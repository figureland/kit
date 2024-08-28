import type { Matrix2D, Vector2 } from '../math'
import { EPS } from '../math/constants'
import { sin, cos, sqrt, abs, max, isNumber, lerp as _lerp, dp } from '../math/number'

export type { Matrix2D } from './api'

/**
 * Creates a new 2D matrix with the specified values.
 * @param a - The value for element [0,0] (default: 1)
 * @param b - The value for element [0,1] (default: 0)
 * @param c - The value for element [1,0] (default: 0)
 * @param d - The value for element [1,1] (default: 1)
 * @param e - The value for element [2,0] (default: 0)
 * @param f - The value for element [2,1] (default: 0)
 * @returns A new Matrix2D
 */
export const matrix2D = (
  a: number = 1,
  b: number = 0,
  c: number = 0,
  d: number = 1,
  e: number = 0,
  f: number = 0
): Matrix2D => [a, b, c, d, e, f]

export default matrix2D

/**
 * Creates a clone of the given 2D matrix.
 * @param m - The matrix to clone
 * @returns A new Matrix2D that is a clone of the input
 */
export const clone = (m: Matrix2D): Matrix2D => matrix2D(m[0], m[1], m[2], m[3], m[4], m[5])

/**
 * Sets the values of a 2D matrix.
 * @param m - The matrix to modify
 * @param a - The value for element [0,0]
 * @param b - The value for element [0,1]
 * @param c - The value for element [1,0]
 * @param d - The value for element [1,1]
 * @param e - The value for element [2,0]
 * @param f - The value for element [2,1]
 * @returns The modified matrix
 */
export const set = (
  m: Matrix2D,
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): Matrix2D => {
  m[0] = a
  m[1] = b
  m[2] = c
  m[3] = d
  m[4] = e
  m[5] = f
  return m
}

/**
 * Checks if the given value is a valid Matrix2D.
 * @param m - The value to check
 * @returns True if the value is a valid Matrix2D, false otherwise
 */
export const isMatrix2D = (m: unknown): m is Matrix2D =>
  m != null && Array.isArray(m) && m.length === 6 && m.every((n) => isNumber(n) && !isNaN(n))

/**
 * Sets the matrix to the identity matrix.
 * @param m - The matrix to modify
 * @returns The modified matrix set to identity
 */
export const identity = (m: Matrix2D): Matrix2D => set(m, 1, 0, 0, 1, 0, 0)

/**
 * Copies the values from one Matrix2D to another.
 * @param m - The destination matrix
 * @param a - The source matrix
 * @returns The modified destination matrix
 */
export const copy = (m: Matrix2D, a: Matrix2D): Matrix2D =>
  set(m, a[0], a[1], a[2], a[3], a[4], a[5])

/**
 * Inverts a Matrix2D.
 * @param m - The matrix to store the result
 * @param a - The matrix to invert
 * @returns The inverted matrix
 */
export const invert = (m: Matrix2D, a: Matrix2D): Matrix2D => {
  let det = determinant(a)
  det = 1.0 / det

  return set(
    m,
    a[3] * det,
    -a[1] * det,
    -a[2] * det,
    a[0] * det,
    (a[2] * a[5] - a[3] * a[4]) * det,
    (a[1] * a[4] - a[0] * a[5]) * det
  )
}

/**
 * Calculates the determinant of a Matrix2D.
 * @param m - The matrix to calculate the determinant for
 * @returns The determinant of the matrix
 */
export const determinant = (m: Matrix2D): number => m[0] * m[3] - m[1] * m[2]

/**
 * Multiplies two Matrix2Ds.
 * @param m - The matrix to store the result
 * @param a - The first matrix to multiply
 * @param b - The second matrix to multiply
 * @returns The result of the matrix multiplication
 */
export const multiply = (m: Matrix2D, a: Matrix2D, b: Matrix2D): Matrix2D =>
  set(
    m,
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5]
  )

/**
 * Rotates a Matrix2D by the given angle.
 * @param m - The matrix to store the result
 * @param a - The matrix to rotate
 * @param rad - The angle of rotation in radians
 * @returns The rotated matrix
 */
export const rotate = (m: Matrix2D, a: Matrix2D, rad: number): Matrix2D => {
  const s = sin(rad)
  const c = cos(rad)
  return set(
    m,
    a[0] * c + a[2] * s,
    a[1] * c + a[3] * s,
    a[0] * -s + a[2] * c,
    a[1] * -s + a[3] * c,
    a[4],
    a[5]
  )
}

/**
 * Scales a Matrix2D by the given vector.
 * @param m - The matrix to store the result
 * @param a - The matrix to scale
 * @param v - The scaling vector
 * @returns The scaled matrix
 */
export const scale = (m: Matrix2D, a: Matrix2D, v: Vector2): Matrix2D =>
  set(m, a[0] * v.x, a[1] * v.x, a[2] * v.y, a[3] * v.y, a[4], a[5])

/**
 * Gets the scale factor of a Matrix2D.
 * @param m - The matrix to get the scale from
 * @returns The scale factor of the matrix
 */
export const getScale = (m: Matrix2D): number => sqrt(m[0] * m[3])

/**
 * Translates a Matrix2D by the given vector.
 * @param m - The matrix to store the result
 * @param a - The matrix to translate
 * @param v - The translation vector
 * @returns The translated matrix
 */
export const translate = (m: Matrix2D, a: Matrix2D, v: Vector2): Matrix2D =>
  set(m, a[0], a[1], a[2], a[3], a[0] * v.x + a[2] * v.y + a[4], a[1] * v.x + a[3] * v.y + a[5])

/**
 * Creates a rotation Matrix2D from the given angle.
 * @param m - The matrix to store the result
 * @param rad - The angle of rotation in radians
 * @returns The rotation matrix
 */
export const fromRotation = (m: Matrix2D, rad: number): Matrix2D => {
  const s = sin(rad)
  const c = cos(rad)

  return set(m, c, s, -s, c, 0, 0)
}

/**
 * Creates a scaling Matrix2D from the given vector.
 * @param m - The matrix to store the result
 * @param v - The scaling vector
 * @returns The scaling matrix
 */
export const fromScaling = (m: Matrix2D, v: Vector2): Matrix2D => set(m, v.x, 0, 0, v.y, 0, 0)

/**
 * Creates a translation Matrix2D from the given vector.
 * @param m - The matrix to store the result
 * @param v - The translation vector
 * @returns The translation matrix
 */
export const fromTranslation = (m: Matrix2D, v: Vector2): Matrix2D => set(m, 1, 0, 0, 1, v.x, v.y)

/**
 * Adds two Matrix2Ds.
 * @param m - The matrix to store the result
 * @param a - The first matrix to add
 * @param b - The second matrix to add
 * @returns The result of the matrix addition
 */
export const add = (m: Matrix2D, a: Matrix2D, b: Matrix2D): Matrix2D =>
  set(m, a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3], a[4] + b[4], a[5] + b[5])

/**
 * Subtracts one Matrix2D from another.
 * @param m - The matrix to store the result
 * @param a - The matrix to subtract from
 * @param b - The matrix to subtract
 * @returns The result of the matrix subtraction
 */
export const subtract = (m: Matrix2D, a: Matrix2D, b: Matrix2D): Matrix2D =>
  set(m, a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4], a[5] - b[5])

/**
 * Multiplies a Matrix2D by a scalar.
 * @param m - The matrix to store the result
 * @param a - The matrix to multiply
 * @param b - The scalar value
 * @returns The result of the scalar multiplication
 */
export const multiplyScalar = (m: Matrix2D, a: Matrix2D, b: number): Matrix2D =>
  set(m, a[0] * b, a[1] * b, a[2] * b, a[3] * b, a[4] * b, a[5] * b)

/**
 * Checks if two Matrix2Ds are approximately equal.
 * @param m - The first matrix to compare
 * @param a - The second matrix to compare
 * @returns True if the matrices are approximately equal, false otherwise
 */
export const equals = (m: Matrix2D, a: Matrix2D): boolean =>
  abs(m[0] - a[0]) <= EPS * max(1.0, abs(m[0]), abs(a[0])) &&
  abs(m[1] - a[1]) <= EPS * max(1.0, abs(m[1]), abs(a[1])) &&
  abs(m[2] - a[2]) <= EPS * max(1.0, abs(m[2]), abs(a[2])) &&
  abs(m[3] - a[3]) <= EPS * max(1.0, abs(m[3]), abs(a[3])) &&
  abs(m[4] - a[4]) <= EPS * max(1.0, abs(m[4]), abs(a[4])) &&
  abs(m[5] - a[5]) <= EPS * max(1.0, abs(m[5]), abs(a[5]))

/**
 * Performs linear interpolation between two Matrix2Ds.
 * @param m - The matrix to store the result
 * @param a - The starting matrix
 * @param b - The ending matrix
 * @param t - The interpolation factor (0-1)
 * @returns The interpolated matrix
 */
export const lerp = (m: Matrix2D, a: Matrix2D, b: Matrix2D, t: number): Matrix2D =>
  set(
    m,
    _lerp(a[0], b[0], t),
    _lerp(a[1], b[1], t),
    _lerp(a[2], b[2], t),
    _lerp(a[3], b[3], t),
    _lerp(a[4], b[4], t),
    _lerp(a[5], b[5], t)
  )

/**
 * Rounds the values of a Matrix2D to a precise number of decimal places.
 * @param m - The matrix to round
 * @returns The matrix with rounded values
 */
export const preciseEnough = (m: Matrix2D): Matrix2D =>
  set(m, dp(m[0]), dp(m[1]), dp(m[2]), dp(m[3]), dp(m[4]), dp(m[5]))
