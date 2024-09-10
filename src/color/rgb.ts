// @ts-ignore
import { serialize, sRGB, DisplayP3, OKLCH } from '@texel/color'
import { state } from '../state'

export type RGB = [number, number, number]
export type RGBA = [number, number, number, number]

export const rgb = (...r: [number, number, number]) => {
  const v: RGB = r[0] > 1.0 ? [r[0] / 255, r[1] / 255, r[2] / 255] : r
  const s = state<RGB>(v)

  return {
    ...s,
    serialize: () => serialize(s.get(), sRGB)
  }
}

export const rgba = (r: number, g: number, b: number, a: number = 1) => {
  const v: RGBA = r > 1.0 ? [r / 255, g / 255, b / 255, a] : [r, g, b, a]
  const s = state(v)

  return {
    ...s,
    serialize: () => serialize(s.get(), sRGB)
  }
}
