// @ts-ignore
import { serialize, sRGB, OKLCH } from '@texel/color'
import { state } from '../state'
import type { Gamut, RGBA, RGBAState } from './api'
import { extend } from '../tools/object'

export const rgba = (r: number, g: number, b: number, a: number = 1): RGBAState => {
  const s = state<RGBA>(r > 1.0 ? [r / 255, g / 255, b / 255, a] : [r, g, b, a])
  return extend(s, {
    serialize: (outputSpace: Gamut = sRGB) => serialize(s.get(), sRGB, outputSpace)
  })
}
