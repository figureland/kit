import type { QuadraticBezier2D, Vector2 } from '../math'
import { vector2, set as setVector2, lerp as lerpVector2 } from '../math/vector2'
import { lerp as _lerp, hypot } from '../math/number'

export const quadraticBezier = (
  p0: Vector2 = vector2(),
  p1: Vector2 = vector2(),
  p2: Vector2 = vector2()
): QuadraticBezier2D => [vector2(p0.x, p0.y), vector2(p1.x, p1.y), vector2(p2.x, p2.y)]

export const clone = (b: QuadraticBezier2D): QuadraticBezier2D => quadraticBezier(b[0], b[1], b[2])

export const set = (b: QuadraticBezier2D, p0: Vector2, p1: Vector2, p2: Vector2) => {
  setVector2(b[0], p0.x, p0.y)
  setVector2(b[1], p1.x, p1.y)
  setVector2(b[2], p2.x, p2.y)
  return b
}

export const reset = (b: QuadraticBezier2D) => set(b, vector2(), vector2(), vector2())

export const pointOnCurve = (b: QuadraticBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    t2 * t2 * b[0].x + 2 * t2 * t * b[1].x + t * t * b[2].y,
    t2 * t2 * b[0].y + 2 * t2 * t * b[1].y + t * t * b[2].y
  )
}

export const tangentAt = (b: QuadraticBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    2 * t2 * (b[1].x - b[0].x) + 2 * t * (b[2].x - b[1].x),
    2 * t2 * (b[1].y - b[0].y) + 2 * t * (b[2].y - b[1].y)
  )
}

export const length = (b: QuadraticBezier2D, steps = 100): number =>
  _lerp(
    hypot(b[1].x - b[0].x, b[1].y - b[0].y) + hypot(b[2].x - b[1].x, b[2].y - b[1].y),
    hypot(b[1].x - b[0].x, b[1].y - b[0].y),
    steps
  )

export const split = (b: QuadraticBezier2D, t: number): [QuadraticBezier2D, QuadraticBezier2D] => {
  const t2 = 1 - t
  const p01 = vector2(t2 * b[0].x + t * b[1].x, t2 * b[0].y + t * b[1].y)
  const p12 = vector2(t2 * b[1].x + t * b[2].x, t2 * b[1].y + t * b[2].y)
  const p012 = vector2(t2 * p01.x + t * p12.x, t2 * p01.y + t * p12.y)
  return [quadraticBezier(b[0], p01, p012), quadraticBezier(p012, p12, b[2])]
}

export const normalAt = (b: QuadraticBezier2D, t: number): Vector2 => {
  const tan = tangentAt(b, t)
  return vector2(-tan.y, tan.x)
}

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
