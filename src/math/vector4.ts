import { sqrt, abs, isNumber, lerp as _lerp, dp } from '../math/number'
import type { Vector4 } from '../math'

export type { Vector4 } from './api'

export const EPS = 0.000001

/**
 * Sets the components of a Vector4.
 * @param v - The vector to modify.
 * @param x - The x component.
 * @param y - The y component.
 * @param z - The z component.
 * @param w - The w component.
 * @returns The modified vector.
 */
export const set = (v: Vector4, x: number, y: number, z: number, w: number): Vector4 => {
  v.x = x
  v.y = y
  v.z = z
  v.w = w
  return v
}

/**
 * Creates a new Vector4.
 * @param x - The x component (default: 0).
 * @param y - The y component (default: 0).
 * @param z - The z component (default: 0).
 * @param w - The w component (default: 0).
 * @returns A new Vector4.
 */
export const vector4 = (x: number = 0, y: number = 0, z: number = 0, w: number = 0): Vector4 => ({
  x,
  y,
  z,
  w
})

/**
 * Checks if a value is a Vector4.
 * @param v - The value to check.
 * @returns True if the value is a Vector4, false otherwise.
 */
export const isVector4 = (v: unknown): v is Vector4 =>
  !!v &&
  isNumber((v as Vector4).x) &&
  isNumber((v as Vector4).y) &&
  isNumber((v as Vector4).z) &&
  isNumber((v as Vector4).w)

/**
 * Creates a clone of a Vector4.
 * @param v - The vector to clone.
 * @returns A new Vector4 with the same components.
 */
export const clone = (v: Vector4): Vector4 => vector4(v.x, v.y, v.z, v.w)

/**
 * Copies the components of one Vector4 to another.
 * @param v - The vector to modify.
 * @param a - The vector to copy from.
 * @returns The modified vector.
 */
export const copy = (v: Vector4, a: Vector4): Vector4 => set(v, a.x, a.y, a.z, a.w)

/**
 * Resets a Vector4 to (0, 0, 0, 0).
 * @param v - The vector to reset.
 * @returns The reset vector.
 */
export const reset = (v: Vector4): Vector4 => set(v, 0, 0, 0, 0)

/**
 * Adds two Vector4s.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector.
 */
export const add = (v: Vector4, a: Vector4, b: Vector4): Vector4 =>
  set(v, a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w)

/**
 * Subtracts one Vector4 from another.
 * @param v - The vector to store the result.
 * @param a - The vector to subtract from.
 * @param b - The vector to subtract.
 * @returns The resulting vector.
 */
export const subtract = (v: Vector4, a: Vector4, b: Vector4): Vector4 =>
  set(v, a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w)

/**
 * Multiplies two Vector4s component-wise.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector.
 */
export const multiply = (v: Vector4, a: Vector4, b: Vector4): Vector4 =>
  set(v, a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w)

/**
 * Divides one Vector4 by another component-wise.
 * @param v - The vector to store the result.
 * @param a - The numerator vector.
 * @param b - The denominator vector.
 * @returns The resulting vector.
 */
export const divide = (v: Vector4, a: Vector4, b: Vector4): Vector4 =>
  set(v, a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w)

/**
 * Scales a Vector4 by a scalar value.
 * @param v - The vector to store the result.
 * @param a - The vector to scale.
 * @param b - The scalar value.
 * @returns The resulting scaled vector.
 */
export const scale = (v: Vector4, a: Vector4, b: number): Vector4 =>
  set(v, a.x * b, a.y * b, a.z * b, a.w * b)

/**
 * Adds a scaled Vector4 to another Vector4.
 * @param v - The vector to store the result.
 * @param a - The base vector.
 * @param b - The vector to be scaled and added.
 * @param scale - The scale factor.
 * @returns The resulting vector.
 */
export const scaleAndAdd = (v: Vector4, a: Vector4, b: Vector4, scale: number): Vector4 =>
  set(v, a.x + b.x * scale, a.y + b.y * scale, a.z + b.z * scale, a.w + b.w * scale)

/**
 * Calculates the length (magnitude) of a Vector4.
 * @param a - The input vector.
 * @returns The length of the vector.
 */
export const length = (a: Vector4): number => sqrt(a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w)

/**
 * Calculates the squared length (magnitude) of a Vector4.
 * @param a - The input vector.
 * @returns The squared length of the vector.
 */
export const squaredLength = (a: Vector4): number => a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w

/**
 * Negates a Vector4.
 * @param v - The vector to store the result.
 * @param a - The vector to negate.
 * @returns The negated vector.
 */
export const negate = (v: Vector4, a: Vector4): Vector4 => set(v, -a.x, -a.y, -a.z, -a.w)

/**
 * Inverts a Vector4 component-wise.
 * @param v - The vector to store the result.
 * @param a - The vector to invert.
 * @returns The inverted vector.
 */
export const inverse = (v: Vector4, a: Vector4): Vector4 =>
  set(v, 1.0 / a.x, 1.0 / a.y, 1.0 / a.z, 1.0 / a.w)

/**
 * Normalizes a Vector4.
 * @param v - The vector to store the result.
 * @param a - The vector to normalize.
 * @returns The normalized vector.
 */
export const normalize = (v: Vector4, a: Vector4): Vector4 => {
  let len = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w
  if (len > 0) {
    len = 1 / sqrt(len)
  }
  return set(v, a.x * len, a.y * len, a.z * len, a.w * len)
}

/**
 * Calculates the dot product of two Vector4s.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The dot product of the two vectors.
 */
export const dot = (a: Vector4, b: Vector4): number => a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w

/**
 * Performs linear interpolation between two Vector4s.
 * @param v - The vector to store the result.
 * @param a - The starting vector.
 * @param b - The ending vector.
 * @param amount - The interpolation amount (0-1).
 * @returns The interpolated vector.
 */
export const lerp = (v: Vector4, a: Vector4, b: Vector4, amount: number): Vector4 =>
  set(
    v,
    _lerp(a.x, b.x, amount),
    _lerp(a.y, b.y, amount),
    _lerp(a.z, b.z, amount),
    _lerp(a.w, b.w, amount)
  )

/**
 * Checks if two Vector4s are exactly equal.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are exactly equal, false otherwise.
 */
export const exactEquals = (a: Vector4, b: Vector4): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w

/**
 * Checks if two Vector4s are approximately equal within a small epsilon.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are approximately equal, false otherwise.
 */
export const equals = (a: Vector4, b: Vector4): boolean =>
  abs(a.x - b.x) <= EPS * Math.max(1.0, abs(a.x), abs(b.x)) &&
  abs(a.y - b.y) <= EPS * Math.max(1.0, abs(a.y), abs(b.y)) &&
  abs(a.z - b.z) <= EPS * Math.max(1.0, abs(a.z), abs(b.z)) &&
  abs(a.w - b.w) <= EPS * Math.max(1.0, abs(a.w), abs(b.w))

/**
 * Rounds the components of a Vector4 to a precise number of decimal places.
 * @param v - The vector to modify.
 * @returns The modified vector with rounded components.
 */
export const preciseEnough = (v: Vector4): Vector4 => set(v, dp(v.x), dp(v.y), dp(v.z), dp(v.w))
