// @ts-ignore
import { serialize, sRGB, DisplayP3, OKLCH } from '@texel/color'
import { state } from '../state'
import type { Gamut, RGBA, RGBAState } from './api'

export const rgba = (r: number, g: number, b: number, a: number = 1): RGBAState => {
  const s = state<RGBA>(r > 1.0 ? [r / 255, g / 255, b / 255, a] : [r, g, b, a])
  return {
    ...s,
    serialize: (inputSpace: Gamut = sRGB, outputSpace: Gamut = sRGB) =>
      serialize(s.get(), inputSpace, outputSpace)
  }
}
