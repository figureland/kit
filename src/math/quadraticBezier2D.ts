import type { QuadraticBezier2D, Vector2 } from '../math'
import { vector2, set as setVector2, lerp as lerpVector2 } from '../math/vector2'
import { lerp as _lerp, hypot } from '../math/number'

/**
 * Creates a new QuadraticBezier2D curve.
 * @param p0 - The start point of the curve.
 * @param p1 - The control point of the curve.
 * @param p2 - The end point of the curve.
 * @returns A new QuadraticBezier2D curve.
 */
export const quadraticBezier = (
  p0: Vector2 = vector2(),
  p1: Vector2 = vector2(),
  p2: Vector2 = vector2()
): QuadraticBezier2D => [vector2(p0.x, p0.y), vector2(p1.x, p1.y), vector2(p2.x, p2.y)]

/**
 * Creates a clone of the given QuadraticBezier2D curve.
 * @param b - The QuadraticBezier2D curve to clone.
 * @returns A new QuadraticBezier2D curve with the same points as the input.
 */
export const clone = (b: QuadraticBezier2D): QuadraticBezier2D => quadraticBezier(b[0], b[1], b[2])

/**
 * Sets the points of a QuadraticBezier2D curve.
 * @param b - The QuadraticBezier2D curve to modify.
 * @param p0 - The new start point.
 * @param p1 - The new control point.
 * @param p2 - The new end point.
 * @returns The modified QuadraticBezier2D curve.
 */
export const set = (
  b: QuadraticBezier2D,
  p0: Vector2,
  p1: Vector2,
  p2: Vector2
): QuadraticBezier2D => {
  setVector2(b[0], p0.x, p0.y)
  setVector2(b[1], p1.x, p1.y)
  setVector2(b[2], p2.x, p2.y)
  return b
}

/**
 * Resets a QuadraticBezier2D curve to the origin.
 * @param b - The QuadraticBezier2D curve to reset.
 * @returns The reset QuadraticBezier2D curve.
 */
export const reset = (b: QuadraticBezier2D): QuadraticBezier2D =>
  set(b, vector2(), vector2(), vector2())

/**
 * Calculates a point on the QuadraticBezier2D curve at a given t value.
 * @param b - The QuadraticBezier2D curve.
 * @param t - The t value (0 to 1) along the curve.
 * @returns The point on the curve at the given t value.
 */
export const pointOnCurve = (b: QuadraticBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    t2 * t2 * b[0].x + 2 * t2 * t * b[1].x + t * t * b[2].x,
    t2 * t2 * b[0].y + 2 * t2 * t * b[1].y + t * t * b[2].y
  )
}

/**
 * Calculates the tangent vector at a given t value on the QuadraticBezier2D curve.
 * @param b - The QuadraticBezier2D curve.
 * @param t - The t value (0 to 1) along the curve.
 * @returns The tangent vector at the given t value.
 */
export const tangentAt = (b: QuadraticBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    2 * t2 * (b[1].x - b[0].x) + 2 * t * (b[2].x - b[1].x),
    2 * t2 * (b[1].y - b[0].y) + 2 * t * (b[2].y - b[1].y)
  )
}

/**
 * Estimates the length of the QuadraticBezier2D curve.
 * @param b - The QuadraticBezier2D curve.
 * @param steps - The number of steps to use for the estimation (default: 100).
 * @returns The estimated length of the curve.
 */
export const length = (b: QuadraticBezier2D, steps = 100): number =>
  _lerp(
    hypot(b[1].x - b[0].x, b[1].y - b[0].y) + hypot(b[2].x - b[1].x, b[2].y - b[1].y),
    hypot(b[1].x - b[0].x, b[1].y - b[0].y),
    steps
  )

/**
 * Splits a QuadraticBezier2D curve into two curves at a given t value.
 * @param b - The QuadraticBezier2D curve to split.
 * @param t - The t value (0 to 1) at which to split the curve.
 * @returns An array containing two new QuadraticBezier2D curves.
 */
export const split = (b: QuadraticBezier2D, t: number): [QuadraticBezier2D, QuadraticBezier2D] => {
  const t2 = 1 - t
  const p01 = vector2(t2 * b[0].x + t * b[1].x, t2 * b[0].y + t * b[1].y)
  const p12 = vector2(t2 * b[1].x + t * b[2].x, t2 * b[1].y + t * b[2].y)
  const p012 = vector2(t2 * p01.x + t * p12.x, t2 * p01.y + t * p12.y)
  return [quadraticBezier(b[0], p01, p012), quadraticBezier(p012, p12, b[2])]
}

/**
 * Calculates the normal vector at a given t value on the QuadraticBezier2D curve.
 * @param b - The QuadraticBezier2D curve.
 * @param t - The t value (0 to 1) along the curve.
 * @returns The normal vector at the given t value.
 */
export const normalAt = (b: QuadraticBezier2D, t: number): Vector2 => {
  const tan = tangentAt(b, t)
  return vector2(-tan.y, tan.x)
}

/**
 * Linearly interpolates between two QuadraticBezier2D curves.
 * @param out - The QuadraticBezier2D curve to store the result.
 * @param a - The first QuadraticBezier2D curve.
 * @param b - The second QuadraticBezier2D curve.
 * @param t - The interpolation factor (0 to 1).
 * @returns The interpolated QuadraticBezier2D curve.
 */
export const lerp = (
  out: QuadraticBezier2D,
  a: QuadraticBezier2D,
  b: QuadraticBezier2D,
  t: number
): QuadraticBezier2D =>
  set(
    out,
    lerpVector2(vector2(), a[0], b[0], t),
    lerpVector2(vector2(), a[1], b[1], t),
    lerpVector2(vector2(), a[2], b[2], t)
  )
