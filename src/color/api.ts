// @ts-ignore
import { sRGB, DisplayP3, OKLCH } from '@texel/color'
import { Vector4 } from '../math'

export type RGBA = {
  type: 'rgba'
  value: Vector4
  set: (r: number, g: number, b: number, a?: number) => void
  serialize: (outputSpace?: Gamut) => string
}

export type OKLCH = {
  type: 'oklch'
  value: Vector4
  set: (r: number, g: number, b: number, a?: number) => void
  serialize: (outputSpace?: Gamut) => string
}

export type Gamut = typeof sRGB | typeof DisplayP3 | typeof OKLCH
