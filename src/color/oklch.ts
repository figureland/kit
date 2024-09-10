// @ts-ignore
import { serialize, sRGB, OKLCH } from '@texel/color'
import { state } from '../state'
import type { Gamut, OKLCHState } from './api'

export const oklch = (l: number, c: number, h: number, a: number): OKLCHState => {
  const s = state<OKLCH>([l, c, h, a])
  return {
    ...s,
    serialize: (outputSpace: Gamut = sRGB) => serialize(s.get(), OKLCH, outputSpace)
  }
}
