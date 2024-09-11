// @ts-ignore
import { serialize, sRGB, OKLCH } from '@texel/color'
import { state } from '../state'
import type { Gamut, OKLCHState } from './api'
import { extend } from '../ts/object'

export const oklch = (l: number, c: number, h: number, a: number): OKLCHState => {
  const s = state<OKLCH>([l, c, h, a])
  return extend(s, {
    serialize: (outputSpace: Gamut = sRGB) => serialize(s.get(), OKLCH, outputSpace)
  })
}
