// @ts-ignore
import { sRGB, DisplayP3, OKLCH } from '@texel/color'
import type { State } from '../state'

export type RGBA = [number, number, number, number]

export type Gamut = typeof sRGB | typeof DisplayP3 | typeof OKLCH

export type RGBAState = State<RGBA> & {
  serialize: (inputSpace?: Gamut, outputSpace?: Gamut) => string
}
