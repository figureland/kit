import {
  ceil as _ceil,
  floor as _floor,
  min as _min,
  max as _max,
  round as _round,
  lerp as _lerp,
  sqrt,
  abs,
  acos,
  sin,
  cos,
  dp,
  isNumber
} from '../math/number'

import type { Matrix2D, Vector2 } from '../math'

export type { Vector2 } from './api'

export const EPS = 0.000001

/**
 * Sets the components of a Vector2.
 * @param v - The vector to modify.
 * @param x - The x component.
 * @param y - The y component.
 * @returns The modified vector.
 */
export const set = (v: Vector2, x: number, y: number): Vector2 => {
  v.x = x
  v.y = y
  return v
}

/**
 * Creates a new Vector2.
 * @param x - The x component (default: 0).
 * @param y - The y component (default: 0).
 * @returns A new Vector2.
 */
export const vector2 = (x: number = 0, y: number = 0): Vector2 => ({ x, y })

/**
 * Checks if a value is a Vector2.
 * @param v - The value to check.
 * @returns True if the value is a Vector2, false otherwise.
 */
export const isVector2 = (v: unknown): v is Vector2 =>
  !!v && isNumber((v as Vector2).x) && isNumber((v as Vector2).y)

/**
 * Creates a clone of a Vector2.
 * @param v - The vector to clone.
 * @returns A new Vector2 with the same components.
 */
export const clone = (v: Vector2): Vector2 => vector2(v.x, v.y)

/**
 * Copies the components of one Vector2 to another.
 * @param v - The vector to modify.
 * @param a - The vector to copy from.
 * @returns The modified vector.
 */
export const copy = (v: Vector2, a: Vector2): Vector2 => set(v, a.x, a.y)

/**
 * Resets a Vector2 to (0, 0).
 * @param v - The vector to reset.
 * @returns The reset vector.
 */
export const reset = (v: Vector2): Vector2 => set(v, 0, 0)

/**
 * Adds two Vector2s.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector.
 */
export const add = (v: Vector2, a: Vector2, b: Vector2): Vector2 => set(v, a.x + b.x, a.y + b.y)

/**
 * Subtracts one Vector2 from another.
 * @param v - The vector to store the result.
 * @param a - The vector to subtract from.
 * @param b - The vector to subtract.
 * @returns The resulting vector.
 */
export const subtract = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, a.x - b.x, a.y - b.y)

/**
 * Multiplies two Vector2s component-wise.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector.
 */
export const multiply = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, a.x * b.x, a.y * b.y)

/**
 * Divides one Vector2 by another component-wise.
 * @param v - The vector to store the result.
 * @param a - The numerator vector.
 * @param b - The denominator vector.
 * @returns The resulting vector.
 */
export const divide = (v: Vector2, a: Vector2, b: Vector2): Vector2 => set(v, a.x / b.x, a.y / b.y)

/**
 * Applies the ceiling function to each component of a Vector2.
 * @param v - The vector to store the result.
 * @param a - The input vector.
 * @returns The resulting vector with ceiled components.
 */
export const ceil = (v: Vector2, a: Vector2): Vector2 => set(v, _ceil(a.x), _ceil(a.y))

/**
 * Applies the floor function to each component of a Vector2.
 * @param v - The vector to store the result.
 * @param a - The input vector.
 * @returns The resulting vector with floored components.
 */
export const floor = (v: Vector2, a: Vector2): Vector2 => set(v, _floor(a.x), _floor(a.y))

/**
 * Creates a new Vector2 with the minimum components of two vectors.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector with minimum components.
 */
export const min = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, _min(a.x, b.x), _min(a.y, b.y))

/**
 * Creates a new Vector2 with the maximum components of two vectors.
 * @param v - The vector to store the result.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The resulting vector with maximum components.
 */
export const max = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, _max(a.x, b.x), _max(a.y, b.y))

/**
 * Rounds each component of a Vector2 to the nearest integer.
 * @param v - The vector to store the result.
 * @param a - The input vector.
 * @returns The resulting vector with rounded components.
 */
export const round = (v: Vector2, a: Vector2): Vector2 => set(v, _round(a.x), _round(a.y))

/**
 * Scales a Vector2 by a scalar value.
 * @param v - The vector to store the result.
 * @param a - The vector to scale.
 * @param b - The scalar value.
 * @returns The resulting scaled vector.
 */
export const scale = (v: Vector2, a: Vector2, b: number): Vector2 => set(v, a.x * b, a.y * b)

/**
 * Adds a scaled Vector2 to another Vector2.
 * @param v - The vector to store the result.
 * @param a - The base vector.
 * @param b - The vector to be scaled and added.
 * @param scale - The scale factor.
 * @returns The resulting vector.
 */
export const scaleAndAdd = (v: Vector2, a: Vector2, b: Vector2, scale: number): Vector2 =>
  set(v, a.x + b.x * scale, a.y + b.y * scale)

/**
 * Calculates the Euclidean distance between two Vector2s.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The distance between the two vectors.
 */
export const distance = (a: Vector2, b: Vector2): number => {
  const x = b.x - a.x
  const y = b.y - a.y
  return sqrt(x * x + y * y)
}

/**
 * Calculates the squared Euclidean distance between two Vector2s.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The squared distance between the two vectors.
 */
export const squaredDistance = (a: Vector2, b: Vector2): number => {
  const x = b.x - a.x
  const y = b.y - a.y
  return x * x + y * y
}

/**
 * Calculates the length (magnitude) of a Vector2.
 * @param a - The input vector.
 * @returns The length of the vector.
 */
export const length = (a: Vector2): number => sqrt(a.x * a.x + a.y * a.y)

/**
 * Calculates the squared length (magnitude) of a Vector2.
 * @param a - The input vector.
 * @returns The squared length of the vector.
 */
export const squaredLength = (a: Vector2): number => a.x * a.x + a.y * a.y

/**
 * Negates a Vector2.
 * @param v - The vector to store the result.
 * @param a - The vector to negate.
 * @returns The negated vector.
 */
export const negate = (v: Vector2, a: Vector2): Vector2 => set(v, -a.x, -a.y)

/**
 * Inverts a Vector2 component-wise.
 * @param v - The vector to store the result.
 * @param a - The vector to invert.
 * @returns The inverted vector.
 */
export const inverse = (v: Vector2, a: Vector2): Vector2 => set(v, 1.0 / a.x, 1.0 / a.y)

/**
 * Normalizes a Vector2.
 * @param v - The vector to store the result.
 * @param a - The vector to normalize.
 * @returns The normalized vector.
 */
export const normalize = (v: Vector2, a: Vector2): Vector2 => {
  let len = a.x * a.x + a.y * a.y
  if (len > 0) {
    len = 1 / sqrt(len)
  }

  return set(v, a.x * len, a.y * len)
}

/**
 * Calculates the dot product of two Vector2s.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The dot product of the two vectors.
 */
export const dot = (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y

/**
 * Performs linear interpolation between two Vector2s.
 * @param v - The vector to store the result.
 * @param a - The starting vector.
 * @param b - The ending vector.
 * @param amount - The interpolation amount (0-1).
 * @returns The interpolated vector.
 */
export const lerp = (v: Vector2, a: Vector2, b: Vector2, amount: number): Vector2 =>
  set(v, _lerp(a.x, b.x, amount), _lerp(a.y, b.y, amount))

/**
 * Transforms a Vector2 by a 2x3 matrix.
 * @param v - The vector to store the result.
 * @param a - The vector to transform.
 * @param m - The 2x3 matrix.
 * @returns The transformed vector.
 */
export const transform = (v: Vector2, a: Vector2, m: Matrix2D): Vector2 =>
  set(v, m[0] * a.x + m[2] * a.y + m[4], m[1] * a.x + m[3] * a.y + m[5])

/**
 * Rotates a Vector2 around a given point.
 * @param v - The vector to store the result.
 * @param a - The vector to rotate.
 * @param b - The point to rotate around.
 * @param rad - The angle of rotation in radians.
 * @returns The rotated vector.
 */
export const rotate = (v: Vector2, a: Vector2, b: Vector2, rad: number): Vector2 => {
  const p0 = a.x - b.x
  const p1 = a.y - b.y
  const s = sin(rad)
  const c = cos(rad)
  return set(v, p0 * c - p1 * s + b.x, p0 * s + p1 * c + b.y)
}

/**
 * Calculates the angle between two Vector2s.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns The angle between the vectors in radians.
 */
export const angle = (a: Vector2, b: Vector2): number => {
  const m = sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y))
  const c = m && (a.x * b.x + a.y * b.y) / m
  return acos(_min(_max(c, -1), 1))
}

/**
 * Checks if two Vector2s are exactly equal.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are exactly equal, false otherwise.
 */
export const exactEquals = (a: Vector2, b: Vector2): boolean => a.x === b.x && a.y === b.y

/**
 * Checks if two Vector2s are approximately equal within a small epsilon.
 * @param a - The first vector.
 * @param b - The second vector.
 * @returns True if the vectors are approximately equal, false otherwise.
 */
export const equals = (a: Vector2, b: Vector2): boolean =>
  abs(a.x - b.x) <= EPS * _max(1.0, abs(a.x), abs(b.x)) &&
  abs(a.y - b.y) <= EPS * _max(1.0, abs(a.y), abs(b.y))

/**
 * Rounds the components of a Vector2 to a precise number of decimal places.
 * @param v - The vector to modify.
 * @returns The modified vector with rounded components.
 */
export const preciseEnough = (v: Vector2): Vector2 => set(v, dp(v.x), dp(v.y))
