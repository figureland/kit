// @ts-ignore
import { serialize, sRGB, OKLCH } from '@texel/color'
import { copy, set, vector4 } from '../math/vector4'
import type { Gamut, RGBA } from './api'
import { freeze } from '../tools/object'

export const rgba = (r: number = 0, g: number = 0, b: number = 0, a: number = 1): RGBA => {
  const value = copy(vector4(), {
    x: r > 1.0 ? r / 255 : r,
    y: g > 1.0 ? g / 255 : g,
    z: b > 1.0 ? b / 255 : b,
    w: a
  })

  return freeze({
    type: 'rgba',
    value,
    set: (r, g, b, a = 1) => set(value, r, g, b, a),
    serialize: (outputSpace: Gamut = sRGB) =>
      serialize([value.x, value.y, value.z, value.w], sRGB, outputSpace)
  })
}
