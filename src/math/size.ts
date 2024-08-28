import type { Size } from './api'
import { dp, isNumber, min } from '../math/number'

export type { Size } from './api'

/**
 * Sets the width and height of a Size object.
 * @param s - The Size object to modify.
 * @param width - The new width.
 * @param height - The new height.
 * @returns The modified Size object.
 */
export const set = (s: Size, width: number, height: number): Size => {
  s.width = width
  s.height = height
  return s
}

/**
 * Creates a new Size object.
 * @param width - The width of the size (default: 0).
 * @param height - The height of the size (default: 0).
 * @returns A new Size object.
 */
export const size = (width: number = 0, height: number = 0): Size => ({
  width,
  height
})

/**
 * Checks if a value is a Size object.
 * @param v - The value to check.
 * @returns True if the value is a Size object, false otherwise.
 */
export const isSize = (v: unknown): v is Size =>
  v != null && isNumber((v as Size).width) && isNumber((v as Size).height)

/**
 * Creates a clone of the given Size object.
 * @param s - The Size object to clone.
 * @returns A new Size object with the same properties.
 */
export const clone = (s: Size): Size => size(s.width, s.height)

/**
 * Copies the properties from one Size object to another.
 * @param s - The Size object to modify.
 * @param a - The source Size object.
 * @returns The modified Size object `s`.
 */
export const copy = (s: Size, a: Size): Size => set(s, a.width, a.height)

/**
 * Resets the Size object dimensions to zero.
 * @param s - The Size object to reset.
 * @returns The reset Size object with zero dimensions.
 */
export const reset = (s: Size): Size => set(s, 0, 0)

/**
 * Resizes a Size object with new width and height.
 * @param v - The Size object to resize.
 * @param width - The new width.
 * @param height - The new height.
 * @returns The resized Size object.
 */
export const resize = (v: Size, width: number, height: number): Size => set(v, width, height)

/**
 * Checks if two Size objects are equal.
 * @param a - The first Size object.
 * @param b - The second Size object.
 * @returns True if the Size objects are equal, false otherwise.
 */
export const equals = (a: Size, b: Size): boolean => a.width === b.width && a.height === b.height

/**
 * Adds two Size objects.
 * @param s - The Size object to modify.
 * @param a - The Size object to add.
 * @returns The modified Size object `s`.
 */
export const add = (s: Size, a: Size): Size => set(s, s.width + a.width, s.height + a.height)

/**
 * Scales a Size object by a factor.
 * @param s - The Size object to scale.
 * @param n - The scaling factor.
 * @returns The scaled Size object.
 */
export const scale = (s: Size, n: number): Size => set(s, s.width * n, s.height * n)

/**
 * Subtracts one Size object from another.
 * @param s - The Size object to modify.
 * @param a - The Size object to subtract.
 * @returns The modified Size object `s`.
 */
export const subtract = (s: Size, a: Size): Size => set(s, s.width - a.width, s.height - a.height)

/**
 * Multiplies two Size objects.
 * @param s - The Size object to modify.
 * @param a - The Size object to multiply by.
 * @returns The modified Size object `s`.
 */
export const multiply = (s: Size, a: Size): Size => set(s, s.width * a.width, s.height * a.height)

/**
 * Divides one Size object by another.
 * @param s - The Size object to modify.
 * @param a - The Size object to divide by.
 * @returns The modified Size object `s`.
 */
export const divide = (s: Size, a: Size): Size => set(s, s.width / a.width, s.height / a.height)

/**
 * Fits an item Size within a container Size while maintaining aspect ratio.
 * @param item - The Size of the item to fit.
 * @param container - The Size of the container.
 * @returns A new Size object representing the fitted dimensions.
 */
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

/**
 * Rounds the width and height of a Size object to a precise enough value.
 * @param s - The Size object to modify.
 * @returns The modified Size object with rounded dimensions.
 */
export const preciseEnough = (s: Size): Size => set(s, dp(s.width), dp(s.height))
