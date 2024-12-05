import { sqrt, abs, isNumber, lerp as _lerp, dp } from '../math/number'
import type { Vector3 } from '../math'
export type { Vector3 } from './api'

export const EPS = 0.000001

/**
 * Sets the components of a Vector3.
 * @param v - The vector to modify.
 * @param x - The x component.
 * @param y - The y component.
 * @param z - The z component.
 * @returns The modified vector.
 */
export const set = (v: Vector3, x: number, y: number, z: number): Vector3 => {
  v.x = x
  v.y = y
  v.z = z
  return v
}

/**
 * Creates a new Vector3.
 * @param x - The x component (default: 0).
 * @param y - The y component (default: 0).
 * @param z - The z component (default: 0).
 * @returns A new Vector3.
 */
export const vector3 = (x: number = 0, y: number = 0, z: number = 0): Vector3 => ({ x, y, z })

/**
 * Checks if a value is a Vector3.
 * @param v - The value to check.
 * @returns True if the value is a Vector3, false otherwise.
 */
export const isVector3 = (v: unknown): v is Vector3 =>
  !!v && isNumber((v as Vector3).x) && isNumber((v as Vector3).y) && isNumber((v as Vector3).z)

/**
 * Creates a clone of a Vector3.
 * @param v - The vector to clone.
 * @returns A new Vector3 with the same components.
 */
export const clone = (v: Vector3): Vector3 => vector3(v.x, v.y, v.z)

/**
 * Copies the components of one Vector3 to another.
 * @param v - The vector to modify.
 * @param a - The vector to copy from.
 * @returns The modified vector.
 */
export const copy = (v: Vector3, a: Vector3): Vector3 => set(v, a.x, a.y, a.z)

/**
 * Resets a Vector3 to (0, 0, 0).
 * @param v - The vector to reset.
 * @returns The reset vector.
 */
export const reset = (v: Vector3): Vector3 => set(v, 0, 0, 0)

/**
 * Adds two Vector3s.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector.
 */
export const add = (v: Vector3, a: Vector3, b: Vector3): Vector3 =>
  set(v, a.x + b.x, a.y + b.y, a.z + b.z)

/**
 * Subtracts one Vector3 from another.
 * @param v - The vector to store the result.
 * @param a - The vector to subtract from.
 * @param b - The vector to subtract.
 * @returns The resulting vector.
 */
export const subtract = (v: Vector3, a: Vector3, b: Vector3): Vector3 =>
  set(v, a.x - b.x, a.y - b.y, a.z - b.z)

/**
 * Multiplies two Vector3s component-wise.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector.
 */
export const multiply = (v: Vector3, a: Vector3, b: Vector3): Vector3 =>
  set(v, a.x * b.x, a.y * b.y, a.z * b.z)

/**
 * Divides one Vector3 by another component-wise.
 * @param v - The vector to store the result.
 * @param a - The numerator vector.
 * @param b - The denominator vector.
 * @returns The resulting vector.
 */
export const divide = (v: Vector3, a: Vector3, b: Vector3): Vector3 =>
  set(v, a.x / b.x, a.y / b.y, a.z / b.z)

/**
 * Scales a Vector3 by a scalar value.
 * @param v - The vector to store the result.
 * @param a - The vector to scale.
 * @param b - The scalar value.
 * @returns The resulting scaled vector.
 */
export const scale = (v: Vector3, a: Vector3, b: number): Vector3 =>
  set(v, a.x * b, a.y * b, a.z * b)

/**
 * Adds a scaled Vector3 to another Vector3.
 * @param v - The vector to store the result.
 * @param a - The base vector.
 * @param b - The vector to be scaled and added.
 * @param scale - The scale factor.
 * @returns The resulting vector.
 */
export const scaleAndAdd = (v: Vector3, a: Vector3, b: Vector3, scale: number): Vector3 =>
  set(v, a.x + b.x * scale, a.y + b.y * scale, a.z + b.z * scale)

/**
 * Calculates the length (magnitude) of a Vector3.
 * @param a - The input vector.
 * @returns The length of the vector.
 */
export const length = (a: Vector3): number => sqrt(a.x * a.x + a.y * a.y + a.z * a.z)

/**
 * Calculates the squared length (magnitude) of a Vector3.
 * @param a - The input vector.
 * @returns The squared length of the vector.
 */
export const squaredLength = (a: Vector3): number => a.x * a.x + a.y * a.y + a.z * a.z

/**
 * Negates a Vector3.
 * @param v - The vector to store the result.
 * @param a - The vector to negate.
 * @returns The negated vector.
 */
export const negate = (v: Vector3, a: Vector3): Vector3 => set(v, -a.x, -a.y, -a.z)

/**
 * Inverts a Vector3 component-wise.
 * @param v - The vector to store the result.
 * @param a - The vector to invert.
 * @returns The inverted vector.
 */
export const inverse = (v: Vector3, a: Vector3): Vector3 => set(v, 1.0 / a.x, 1.0 / a.y, 1.0 / a.z)

/**
 * Normalizes a Vector3.
 * @param v - The vector to store the result.
 * @param a - The vector to normalize.
 * @returns The normalized vector.
 */
export const normalize = (v: Vector3, a: Vector3): Vector3 => {
  let len = a.x * a.x + a.y * a.y + a.z * a.z
  if (len > 0) {
    len = 1 / sqrt(len)
  }
  return set(v, a.x * len, a.y * len, a.z * len)
}

/**
 * Calculates the dot product of two Vector3s.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The dot product of the two vectors.
 */
export const dot = (a: Vector3, b: Vector3): number => a.x * b.x + a.y * b.y + a.z * b.z

/**
 * Calculates the cross product of two Vector3s.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The cross product vector.
 */
export const cross = (v: Vector3, a: Vector3, b: Vector3): Vector3 =>
  set(v, a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)

/**
 * Performs linear interpolation between two Vector3s.
 * @param v - The vector to store the result.
 * @param a - The starting vector.
 * @param b - The ending vector.
 * @param amount - The interpolation amount (0-1).
 * @returns The interpolated vector.
 */
export const lerp = (v: Vector3, a: Vector3, b: Vector3, amount: number): Vector3 =>
  set(v, _lerp(a.x, b.x, amount), _lerp(a.y, b.y, amount), _lerp(a.z, b.z, amount))

/**
 * Checks if two Vector3s are exactly equal.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are exactly equal, false otherwise.
 */
export const exactEquals = (a: Vector3, b: Vector3): boolean =>
  a.x === b.x && a.y === b.y && a.z === b.z

/**
 * Checks if two Vector3s are approximately equal within a small epsilon.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are approximately equal, false otherwise.
 */
export const equals = (a: Vector3, b: Vector3): boolean =>
  abs(a.x - b.x) <= EPS * Math.max(1.0, abs(a.x), abs(b.x)) &&
  abs(a.y - b.y) <= EPS * Math.max(1.0, abs(a.y), abs(b.y)) &&
  abs(a.z - b.z) <= EPS * Math.max(1.0, abs(a.z), abs(b.z))

/**
 * Rounds the components of a Vector3 to a precise number of decimal places.
 * @param v - The vector to modify.
 * @returns The modified vector with rounded components.
 */
export const preciseEnough = (v: Vector3): Vector3 => set(v, dp(v.x), dp(v.y), dp(v.z))
