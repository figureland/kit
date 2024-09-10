// @ts-ignore
import { serialize, sRGB, DisplayP3, OKLCH } from '@texel/color'
import { State, state } from '../state'

export type RGB = [number, number, number] | [number, number, number, number]

export type Gamut = typeof sRGB | typeof DisplayP3 | typeof OKLCH

export type RGBState = State<RGB> & {
  serialize: (inputSpace?: Gamut, outputSpace?: Gamut) => string
}

export const rgba = (r: number, g: number, b: number, a: number = 1) => {
  const v: RGB = r > 1.0 ? [r / 255, g / 255, b / 255, a] : [r, g, b, a]
  const s = state(v)
  return {
    ...s,
    serialize: (inputSpace: Gamut = sRGB, outputSpace: Gamut = sRGB) =>
      serialize(s.get(), inputSpace, outputSpace)
  }
}
