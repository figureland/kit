import { entries } from '../../tools'
import type { WasmGenerator } from '../wasm/wasm.types'
import type {
  HBWasmModule,
  HBFontDirection,
  HBBufferFlag,
  HBJSONCharacter,
  HBTextOptions,
  HBJSONRepresentation,
  HBTextFeature
} from './api.types'
import { buffer_flag, hb_tag, hb_untag } from './utils'

const HB_MEMORY_MODE_WRITABLE = 2
const HB_SET_VALUE_INVALID = -1

export type HBFontManifest = Record<string, ArrayBuffer>

export const createHarfbuzz = async (generate: WasmGenerator, fonts?: HBFontManifest) => {
  const instance = await generate()
  const client = new Harfbuzz(instance)
  if (fonts) {
    for (const [name, data] of entries(fonts)) {
      client.importFont(name, data)
    }
  }
  return client
}

export class Harfbuzz {
  public heapu8: Uint8Array
  public heapu32: Uint32Array
  public heapi32: Int32Array
  public heapf32: Float32Array
  public decoder: TextDecoder
  public exports: HBWasmModule
  private fonts = new Map<string, HBFont>()

  public readonly pathBufferSize: number
  public readonly pathBuffer: number
  public readonly nameBufferSize: number
  public readonly nameBuffer: number

  constructor(public readonly wasm: WebAssembly.Instance) {
    this.exports = this.wasm.exports as unknown as HBWasmModule
    this.heapu8 = new Uint8Array(this.exports.memory.buffer)
    this.heapu32 = new Uint32Array(this.exports.memory.buffer)
    this.heapi32 = new Int32Array(this.exports.memory.buffer)
    this.heapf32 = new Float32Array(this.exports.memory.buffer)
    this.decoder = new TextDecoder('utf8')

    this.pathBufferSize = 65536
    this.pathBuffer = this.exports.malloc(this.pathBufferSize)

    this.nameBufferSize = 256
    this.nameBuffer = this.exports.malloc(this.nameBufferSize)
  }

  public dispose = () => {
    this.fonts.forEach((font) => font.destroy())
    this.fonts.clear()
    this.exports.free(this.pathBuffer)
    this.exports.free(this.nameBuffer)
  }

  public shapeWithTrace(
    font: HBFont,
    buffer: HBBuffer,
    features: string,
    stop_at: number,
    stop_phase: 0 | 1 | 2
  ) {
    const length = 1024 * 1024
    const traceBuffer = this.exports.malloc(length)
    const featureStr = this.createASCIIString(features)
    const traceLength = this.exports.hbjs_shape_with_trace(
      font.ptr,
      buffer.ptr,
      featureStr.ptr,
      stop_at,
      stop_phase,
      traceBuffer,
      length
    )
    featureStr.free()
    const trace = this.decoder.decode(
      this.heapu8.subarray(traceBuffer, traceBuffer + traceLength - 1)
    )
    this.exports.free(traceBuffer)

    return JSON.parse(trace)
  }

  public shape = (font: HBFont, buffer: HBBuffer) => {
    return this.exports.hb_shape(font.ptr, buffer.ptr, 0, 0)
  }

  public resolveTypedArrayFromSet(ptr: number, type: 'u8' | 'u32' | 'i32' | 'f32') {
    const heap: Uint8Array | Uint32Array | Int32Array | Float32Array =
      type === 'u32'
        ? this.heapu32
        : type === 'i32'
          ? this.heapi32
          : type === 'f32'
            ? this.heapf32
            : this.heapu8

    const bytesPerElment =
      type === 'u32'
        ? Uint32Array.BYTES_PER_ELEMENT
        : type === 'i32'
          ? Int32Array.BYTES_PER_ELEMENT
          : type === 'f32'
            ? Float32Array.BYTES_PER_ELEMENT
            : Uint8Array.BYTES_PER_ELEMENT

    const setCount = this.exports.hb_set_get_population(ptr)
    const arrayPtr = this.exports.malloc(setCount * bytesPerElment)
    const arrayOffset = arrayPtr / bytesPerElment
    const array = heap.subarray(arrayOffset, arrayOffset + setCount)
    heap.set(array, arrayOffset)
    this.exports.hb_set_next_many(ptr, HB_SET_VALUE_INVALID, arrayPtr, setCount)
    return array
  }

  public createBuffer = () => new HBBuffer(this)

  public importFont = (name: string, data: ArrayBuffer) => {
    const existing = this.fonts.get(name)

    if (existing) {
      return existing
    }
    const harfbuzzBlob = this.createBlob(data)
    const harfbuzzFace = this.createFace(harfbuzzBlob, 0)
    const font = this.createFont(harfbuzzFace)
    this.fonts.set(name, font)
    return font
  }

  public getFont = (name: string) => {
    const existing = this.fonts.get(name)

    if (!existing) {
      throw new Error(`Font "${name}" not found`)
    }
    return existing
  }
  public createText = (
    text: string,
    font: HBFont,
    options: HBTextOptions = {
      direction: 'ltr'
    }
  ) => {
    const textBuffer = this.createBuffer()
    textBuffer.addText(text)
    textBuffer.guessSegmentProperties()
    textBuffer.setDirection(options.direction)

    if (options.variations) {
      font.setVariations(options.variations)
    }

    if (options.features && options.features.length > 0) {
      const featuresPtr = this.createFeaturesArray(options.features)
      this.shapeWithFeatures(font, textBuffer, featuresPtr, options.features.length)
      this.exports.free(featuresPtr)
    } else {
      this.shape(font, textBuffer)
    }

    return textBuffer
  }

  private createFeaturesArray(features: HBTextFeature[]) {
    const featureSize = 8
    const featuresPtr = this.exports.malloc(featureSize * features.length)

    features.forEach((feature, i) => {
      const offset = featuresPtr / 4 + i * 2
      this.heapu32[offset] = hb_tag(feature.tag)
      this.heapu32[offset + 1] = feature.value
    })

    return featuresPtr
  }

  private shapeWithFeatures = (
    font: HBFont,
    buffer: HBBuffer,
    featuresPtr: number,
    numFeatures: number
  ) => {
    return this.exports.hb_shape(font.ptr, buffer.ptr, featuresPtr, numFeatures)
  }
  public createFont = (face: HBFace) => new HBFont(this, face)
  public createFace = (blob: HBBlob, index: number) => new HBFace(this, blob, index)
  public createBlob = (blob: ArrayBuffer) => new HBBlob(this, blob)
  public createASCIIString = (text: string) => new HBASCIIString(this, text)
  public createJSString = (text: string) => new HBJSString(this, text)
}

export class HBJSString {
  ptr: number
  length: number

  /**
   * Create an object representing a Harfbuzz blob.
   * @param blob A blob of binary data (usually the contents of a font file).
   */

  constructor(
    private instance: Harfbuzz,
    text: string
  ) {
    this.ptr = this.instance.exports.malloc(text.length * 2)
    const words = new Uint16Array(this.instance.exports.memory.buffer, this.ptr, text.length)
    for (let i = 0; i < words.length; ++i) words[i] = text.charCodeAt(i)
    this.length = words.length
  }
  free = () => {
    this.instance.exports.free(this.ptr)
  }
}

export class HBASCIIString {
  ptr: number
  length: number

  /**
   * Create an object representing a Harfbuzz blob.
   * @param blob A blob of binary data (usually the contents of a font file).
   */

  constructor(
    private instance: Harfbuzz,
    text: string
  ) {
    this.length = text.length
    this.ptr = this.instance.exports.malloc(this.length + 1)
    for (let i = 0; i < this.length; ++i) {
      const char = text.charCodeAt(i)
      if (char > 127) throw new Error('Expected ASCII text')
      this.instance.heapu8[this.ptr + i] = char
    }
    this.instance.heapu8[this.ptr + this.length] = 0
  }

  free = () => {
    this.instance.exports.free(this.ptr)
  }
}

export class HBFace {
  ptr: number
  upem: number

  constructor(
    private instance: Harfbuzz,
    blob: HBBlob,
    index: number
  ) {
    this.ptr = instance.exports.hb_face_create(blob.ptr, index)
    this.upem = instance.exports.hb_face_get_upem(this.ptr)
  }

  reference_table = (table: string) => {
    const blob = this.instance.exports.hb_face_reference_table(this.ptr, hb_tag(table))
    const length = this.instance.exports.hb_blob_get_length(blob)
    if (!length) return

    const blobPtr = this.instance.exports.hb_blob_get_data(blob, null)
    return this.instance.heapu8.subarray(blobPtr)
  }

  getAxisInfos = () => {
    const axis = this.instance.exports.malloc(64 * 32)
    const c = this.instance.exports.malloc(4)
    this.instance.heapu32[c / 4] = 64
    this.instance.exports.hb_ot_var_get_axis_infos(this.ptr, 0, c, axis)
    const result: { [p: string]: { min: number; default: number; max: number } } = {}
    Array.from({ length: this.instance.heapu32[c / 4] }).forEach((_, i) => {
      result[hb_untag(this.instance.heapu32[axis / 4 + i * 8 + 1])] = {
        min: this.instance.heapf32[axis / 4 + i * 8 + 4],
        default: this.instance.heapf32[axis / 4 + i * 8 + 5],
        max: this.instance.heapf32[axis / 4 + i * 8 + 6]
      }
      this.instance
    })
    this.instance.exports.free(c)
    this.instance.exports.free(axis)

    return result
  }
  collectUnicodes = () => {
    const unicodeSetPtr = exports.hb_set_create()
    this.instance.exports.hb_face_collect_unicodes(this.ptr, unicodeSetPtr)
    const result = this.instance.resolveTypedArrayFromSet(unicodeSetPtr, 'u32') as Uint32Array
    this.instance.exports.hb_set_destroy(unicodeSetPtr)
    return result
  }
  destroy = () => {
    this.instance.exports.hb_face_destroy(this.ptr)
  }
}

export class HBBlob {
  ptr: number
  constructor(
    private instance: Harfbuzz,
    blob: ArrayBuffer
  ) {
    const blobPtr = this.instance.exports.malloc(blob.byteLength)
    this.instance.heapu8.set(new Uint8Array(blob), blobPtr)
    this.ptr = this.instance.exports.hb_blob_create(
      blobPtr,
      blob.byteLength,
      HB_MEMORY_MODE_WRITABLE,
      blobPtr,
      this.instance.exports.free_ptr()
    )
  }
  destroy = () => {
    this.instance.exports.hb_blob_destroy(this.ptr)
  }
}

export class HBFont {
  ptr: number
  constructor(
    private instance: Harfbuzz,
    face: HBFace
  ) {
    this.ptr = this.instance.exports.hb_font_create(face.ptr)
  }
  public glyphToPath = (glyphId: number): string => {
    const { pathBuffer, pathBufferSize } = this.instance
    const length = this.instance.exports.hbjs_glyph_svg(
      this.ptr,
      glyphId,
      pathBuffer,
      pathBufferSize
    )
    return length > 0
      ? this.instance.decoder.decode(this.instance.heapu8.subarray(pathBuffer, pathBuffer + length))
      : ''
  }

  /**
   * Return glyph name.
   * @param {number} glyphId ID of the requested glyph in the font.
   **/
  public glyphName = (glyphId: number): string => {
    const { nameBuffer, nameBufferSize } = this.instance
    this.instance.exports.hb_font_glyph_to_string(this.ptr, glyphId, nameBuffer, nameBufferSize)
    const array = this.instance.heapu8.subarray(nameBuffer, nameBuffer + nameBufferSize)
    return this.instance.decoder.decode(array.slice(0, array.indexOf(0)))
  }

  public glyphToJson = (glyphId: number): HBJSONRepresentation[] => {
    const path = this.glyphToPath(glyphId)
    return path
      .replace(/([MLQCZ])/g, '|$1 ')
      .split('|')
      .filter((v) => v.length)
      .map((v) => {
        const row = v.split(/[ ,]/g)
        return {
          type: row[0],
          values: row
            .slice(1)
            .filter((v) => v.length)
            .map((n) => Number(n))
        }
      })
  }

  /**
   * Set the font's scale factor, affecting the position values returned from
   * shaping.
   * @param {number} xScale Units to scale in the X dimension.
   * @param {number} yScale Units to scale in the Y dimension.
   **/
  public setScale = (xScale: number, yScale: number) => {
    this.instance.exports.hb_font_set_scale(this.ptr, xScale, yScale)
  }

  /**
   * Set the font's variations.
   * @param {object} variations Dictionary of variations to set
   **/
  public setVariations = (variations: Record<string, number>) => {
    const entries = Object.entries(variations)
    const vars = this.instance.exports.malloc(8 * entries.length)
    entries.forEach((entry, i) => {
      this.instance.heapu32[vars / 4 + i * 2 + 0] = hb_tag(entry[0])
      this.instance.heapf32[vars / 4 + i * 2 + 1] = entry[1]
    })
    this.instance.exports.hb_font_set_variations(this.ptr, vars, entries.length)
    this.instance.exports.free(vars)
  }

  public getAxes = () => {
    const axisCountPtr = this.instance.exports.malloc(4)
    const axesArrayPtr = this.instance.exports.malloc(64 * 32)
    this.instance.heapu32[axisCountPtr / 4] = 32

    this.instance.exports.hb_ot_var_get_axis_infos(this.ptr, 0, axisCountPtr, axesArrayPtr)
    console.log(this.instance.exports)
    const axisCount = this.instance.heapu32[axisCountPtr / 4]
    const result: { tag: string; min: number; default: number; max: number }[] = []

    for (let i = 0; i < axisCount; i++) {
      const baseIndex = axesArrayPtr / 4 + i * 8
      const tag = hb_untag(this.instance.heapu32[baseIndex + 1])
      const min = this.instance.heapf32[baseIndex + 4]
      const defaultVal = this.instance.heapf32[baseIndex + 5]
      const max = this.instance.heapf32[baseIndex + 6]
      result.push({ tag, min, default: defaultVal, max })
    }

    this.instance.exports.free(axisCountPtr)
    this.instance.exports.free(axesArrayPtr)

    return result
  }

  public destroy = () => {
    this.instance.exports.hb_font_destroy(this.ptr)
  }
}

export class HBBuffer {
  public readonly ptr: number

  constructor(private instance: Harfbuzz) {
    this.ptr = this.instance.exports.hb_buffer_create()
  }

  public addText = (text: string) => {
    const str = this.instance.createJSString(text)
    this.instance.exports.hb_buffer_add_utf16(this.ptr, str.ptr, str.length, 0, str.length)
    str.free()
  }

  public guessSegmentProperties = () => {
    return this.instance.exports.hb_buffer_guess_segment_properties(this.ptr)
  }

  public setDirection = (dir: HBFontDirection) => {
    this.instance.exports.hb_buffer_set_direction(
      this.ptr,
      {
        ltr: 4,
        rtl: 5,
        ttb: 6,
        btt: 7
      }[dir] || 0
    )
  }

  public setFlags = (flags: HBBufferFlag[]) => {
    const flag = flags.reduce((res, item) => (res |= buffer_flag(item)), 0)
    this.instance.exports.hb_buffer_set_flags(this.ptr, flag)
  }

  public setLanguage = (language: string) => {
    const str = this.instance.createASCIIString(language)
    this.instance.exports.hb_buffer_set_language(
      this.ptr,
      this.instance.exports.hb_language_from_string(str.ptr, -1)
    )
    str.free()
  }

  public setScript = (script: string) => {
    const str = this.instance.createASCIIString(script)
    this.instance.exports.hb_buffer_set_script(
      this.ptr,
      this.instance.exports.hb_script_from_string(str.ptr, -1)
    )
    str.free()
  }

  public setClusterLevel = (level: number) => {
    this.instance.exports.hb_buffer_set_cluster_level(this.ptr, level)
  }
  /**
   * Return the buffer contents as a JSON object.
   *
   * After shaping, this function will return an array of glyph information
   * objects. Each object will have the following attributes:
   *
   *   - g: The glyph ID
   *   - cl: The cluster ID
   *   - ax: Advance width (width to advance after this glyph is painted)
   *   - ay: Advance height (height to advance after this glyph is painted)
   *   - dx: X displacement (adjustment in X dimension when painting this glyph)
   *   - dy: Y displacement (adjustment in Y dimension when painting this glyph)
   *   - flags: Glyph flags like `HB_GLYPH_FLAG_UNSAFE_TO_BREAK` (0x1)
   **/
  public json = () => {
    const length = this.instance.exports.hb_buffer_get_length(this.ptr)
    const infosPtr = this.instance.exports.hb_buffer_get_glyph_infos(this.ptr, 0)
    const infosPtr32 = infosPtr / 4
    const positionsPtr32 = this.instance.exports.hb_buffer_get_glyph_positions(this.ptr, 0) / 4
    const infos = this.instance.heapu32.subarray(infosPtr32, infosPtr32 + 5 * length)
    const positions = this.instance.heapi32.subarray(positionsPtr32, positionsPtr32 + 5 * length)
    const result: HBJSONCharacter[] = []
    for (let i = 0; i < length; ++i) {
      result.push({
        g: infos[i * 5 + 0],
        cl: infos[i * 5 + 2],
        ax: positions[i * 5 + 0],
        ay: positions[i * 5 + 1],
        dx: positions[i * 5 + 2],
        dy: positions[i * 5 + 3],
        flags: this.instance.exports.hb_glyph_info_get_glyph_flags(infosPtr + i * 20)
      })
    }
    return result
  }
  public destroy = () => {
    this.instance.exports.hb_buffer_destroy(this.ptr)
  }
}
