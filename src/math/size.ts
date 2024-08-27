import type { Size } from './api'
import { dp, isNumber, min } from '../math/number'

export type { Size } from './api'

export const set = (s: Size, width: number, height: number) => {
  s.width = width
  s.height = height
  return s
}

export const size = (width: number = 0, height: number = 0): Size => ({
  width,
  height
})

export const isSize = (v: unknown): v is Size =>
  v != null && isNumber((v as Size).width) && isNumber((v as Size).height)
/**
 * Creates a clone of the given box.
 * @param v - The box to clone.
 * @returns A new box with the same properties.
 */
export const clone = (s: Size) => size(s.width, s.height)

/**
 * Copies the properties from one box to another.
 * @param v - The box to modify.
 * @param a - The source box.
 * @returns The modified box `v`.
 */
export const copy = (s: Size, a: Size) => set(s, a.width, a.height)

/**
 * Resets the box dimensions to zero.
 * @param v - The box to reset.
 * @returns The reset box with zero dimensions.
 */
export const reset = (s: Size) => set(s, 0, 0)

export const resize = (v: Size, width: number, height: number) => set(v, width, height)

export const equals = (a: Size, b: Size) => a.width === b.width && a.height === b.height

export const add = (s: Size, a: Size) => set(s, s.width + a.width, s.height + a.height)

export const scale = (s: Size, n: number) => set(s, s.width * n, s.height * n)

export const subtract = (s: Size, a: Size) => set(s, s.width - a.width, s.height - a.height)

export const multiply = (s: Size, a: Size) => set(s, s.width * a.width, s.height * a.height)

export const divide = (s: Size, a: Size) => set(s, s.width / a.width, s.height / a.height)

export const fit = (item: Size, container: Size): Size => {
  const itemAspectRatio = item.width / item.height
  const containerAspectRatio = container.width / container.height

  let width: number
  let height: number

  if (itemAspectRatio > containerAspectRatio) {
    width = min(item.width, container.width)
    height = width / itemAspectRatio
  } else {
    height = min(item.height, container.height)
    width = height * itemAspectRatio
  }

  return size(width, height)
}

export const preciseEnough = (s: Size) => set(s, dp(s.width), dp(s.height))
