import type { CubicBezier2D, Vector2 } from '../math'
import {
  vector2,
  set as setVector2,
  clone as cloneVector2,
  lerp as lerpVector2
} from '../math/vector2'
import { lerp as _lerp, hypot } from '../math/number'

const cubicBezier = (
  p0: Vector2 = vector2(),
  p1: Vector2 = vector2(),
  p2: Vector2 = vector2(),
  p3: Vector2 = vector2()
): CubicBezier2D => [cloneVector2(p0), cloneVector2(p1), cloneVector2(p2), cloneVector2(p3)]

export default cubicBezier

export const clone = (b: CubicBezier2D): CubicBezier2D => cubicBezier(b[0], b[1], b[2], b[3])

export const set = (b: CubicBezier2D, p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2) => {
  setVector2(b[0], p0.x, p0.y)
  setVector2(b[1], p1.x, p1.y)
  setVector2(b[2], p2.x, p2.y)
  setVector2(b[3], p3.x, p3.y)
  return b
}

export const reset = (b: CubicBezier2D) => set(b, vector2(), vector2(), vector2(), vector2())

export const pointOnCurve = (b: CubicBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    t2 * t2 * t2 * b[0].x + 3 * t2 * t2 * t * b[1].x + 3 * t2 * t * t * b[2].x + t * t * t * b[3].x,
    t2 * t2 * t2 * b[0].y + 3 * t2 * t2 * t * b[1].y + 3 * t2 * t * t * b[2].x + t * t * t * b[3].y
  )
}

export const tangentAt = (b: CubicBezier2D, t: number): Vector2 => {
  const t2 = 1 - t
  return vector2(
    3 * t2 * t2 * (b[1].x - b[0].x) +
      6 * t2 * t * (b[2].x - b[1].x) +
      3 * t * t * (b[3].x - b[2].x),
    3 * t2 * t2 * (b[1].y - b[0].y) + 6 * t2 * t * (b[2].y - b[1].y) + 3 * t * t * (b[3].y - b[2].y)
  )
}

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

export const normalAt = (b: CubicBezier2D, t: number): Vector2 => {
  const tan = tangentAt(b, t)
  return vector2(-tan.y, tan.x)
}

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
