// @ts-ignore
import { serialize, sRGB, OKLCH as texelOKLCH } from '@texel/color'
import type { Gamut, OKLCH } from './api'
import { freeze } from '../tools/object'
import { vector4, set } from '../math/vector4'

export const oklch = (r: number = 0, g: number = 0, b: number = 0, a: number = 1): OKLCH => {
  const value = vector4(r, g, b, a)

  return freeze({
    type: 'oklch',
    value,
    set: (l, c, h, a = 1) => set(value, l, c, h, a),
    serialize: (outputSpace: Gamut = sRGB) =>
      serialize([value.x, value.y, value.z, value.w], texelOKLCH, outputSpace)
  })
}
