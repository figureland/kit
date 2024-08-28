import type { CubicBezier2D, Vector2 } from '../math'
import {
  vector2,
  set as setVector2,
  clone as cloneVector2,
  lerp as lerpVector2
} from '../math/vector2'
import { lerp as _lerp, hypot } from '../math/number'

/**
 * Creates a new cubic Bezier curve.
 * @param p0 - The start point of the curve.
 * @param p1 - The first control point.
 * @param p2 - The second control point.
 * @param p3 - The end point of the curve.
 * @returns A new CubicBezier2D object.
 */
const cubicBezier = (
  p0: Vector2 = vector2(),
  p1: Vector2 = vector2(),
  p2: Vector2 = vector2(),
  p3: Vector2 = vector2()
): CubicBezier2D => [cloneVector2(p0), cloneVector2(p1), cloneVector2(p2), cloneVector2(p3)]

export default cubicBezier

/**
 * Creates a deep clone of a cubic Bezier curve.
 * @param b - The cubic Bezier curve to clone.
 * @returns A new CubicBezier2D object.
 */
export const clone = (b: CubicBezier2D): CubicBezier2D => cubicBezier(b[0], b[1], b[2], b[3])

/**
 * Sets the control points of a cubic Bezier curve.
 * @param b - The cubic Bezier curve to modify.
 * @param p0 - The new start point.
 * @param p1 - The new first control point.
 * @param p2 - The new second control point.
 * @param p3 - The new end point.
 * @returns The modified CubicBezier2D object.
 */
export const set = (b: CubicBezier2D, p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2): CubicBezier2D => {
  setVector2(b[0], p0.x, p0.y)
  setVector2(b[1], p1.x, p1.y)
  setVector2(b[2], p2.x, p2.y)
  setVector2(b[3], p3.x, p3.y)
  return b
}

/**
 * Resets a cubic Bezier curve to the origin.
 * @param b - The cubic Bezier curve to reset.
 * @returns The reset CubicBezier2D object.
 */
export const reset = (b: CubicBezier2D): CubicBezier2D => set(b, vector2(), vector2(), vector2(), vector2())

/**
 * Calculates a point on the cubic Bezier curve at a given t value.
 * @param b - The cubic Bezier curve.
 * @param t - The t parameter (0 <= t <= 1).
 * @returns The point on the curve at t.
 */
export const pointOnCurve = (b: CubicBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    t2 * t2 * t2 * b[0].x + 3 * t2 * t2 * t * b[1].x + 3 * t2 * t * t * b[2].x + t * t * t * b[3].x,
    t2 * t2 * t2 * b[0].y + 3 * t2 * t2 * t * b[1].y + 3 * t2 * t * t * b[2].x + t * t * t * b[3].y
  )
}

/**
 * Calculates the tangent vector at a given t value on the cubic Bezier curve.
 * @param b - The cubic Bezier curve.
 * @param t - The t parameter (0 <= t <= 1).
 * @returns The tangent vector at t.
 */
export const tangentAt = (b: CubicBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    3 * t2 * t2 * (b[1].x - b[0].x) +
      6 * t2 * t * (b[2].x - b[1].x) +
      3 * t * t * (b[3].x - b[2].x),
    3 * t2 * t2 * (b[1].y - b[0].y) + 6 * t2 * t * (b[2].y - b[1].y) + 3 * t * t * (b[3].y - b[2].y)
  )
}

/**
 * Calculates the approximate length of the cubic Bezier curve.
 * @param b - The cubic Bezier curve.
 * @param steps - The number of steps to use for approximation (default: 100).
 * @returns The approximate length of the curve.
 */
export const length = (b: CubicBezier2D, steps = 100): number => {
  let len = 0
  let prev = b[0]
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const next = pointOnCurve(b, t)
    len += hypot(next.x - prev.x, next.y - prev.y)
    prev = next
  }
  return len
}

/**
 * Splits a cubic Bezier curve into two curves at a given t value.
 * @param b - The cubic Bezier curve to split.
 * @param t - The t parameter at which to split (0 < t < 1).
 * @returns An array containing two new CubicBezier2D objects.
 */
export const split = (b: CubicBezier2D, t: number): [CubicBezier2D, CubicBezier2D] => {
  const t2 = 1 - t
  const p01 = vector2(t2 * b[0].x + t * b[1].x, t2 * b[0].y + t * b[1].y)
  const p12 = vector2(t2 * b[1].x + t * b[2].x, t2 * b[1].y + t * b[2].y)
  const p23 = vector2(t2 * b[2].x + t * b[3].x, t2 * b[2].y + t * b[3].y)
  const p012 = vector2(t2 * p01.x + t * p12.x, t2 * p01.y + t * p12.y)
  const p123 = vector2(t2 * p12.x + t * p23.x, t2 * p12.y + t * p23.y)
  const p0123 = vector2(t2 * p012.x + t * p123.x, t2 * p012.y + t * p123.y)
  return [cubicBezier(b[0], p01, p012, p0123), cubicBezier(p0123, p123, p23, b[3])]
}

/**
 * Calculates the normal vector at a given t value on the cubic Bezier curve.
 * @param b - The cubic Bezier curve.
 * @param t - The t parameter (0 <= t <= 1).
 * @returns The normal vector at t.
 */
export const normalAt = (b: CubicBezier2D, t: number): Vector2 => {
  const tan = tangentAt(b, t)
  return vector2(-tan.y, tan.x)
}

/**
 * Linearly interpolates between two cubic Bezier curves.
 * @param out - The output CubicBezier2D object to store the result.
 * @param a - The first cubic Bezier curve.
 * @param b - The second cubic Bezier curve.
 * @param t - The interpolation parameter (0 <= t <= 1).
 * @returns The interpolated CubicBezier2D object.
 */
export const lerp = (
  out: CubicBezier2D,
  a: CubicBezier2D,
  b: CubicBezier2D,
  t: number
): CubicBezier2D =>
  set(
    out,
    lerpVector2(vector2(), a[0], b[0], t),
    lerpVector2(vector2(), a[1], b[1], t),
    lerpVector2(vector2(), a[2], b[2], t),
    lerpVector2(vector2(), a[3], b[3], t)
  )
