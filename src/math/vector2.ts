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

export const set = (v: Vector2, x: number, y: number): Vector2 => {
  v.x = x
  v.y = y
  return v
}

export const vector2 = (x: number = 0, y: number = 0): Vector2 => ({ x, y })

export const isVector2 = (v: unknown): v is Vector2 =>
  !!v && isNumber((v as Vector2).x) && isNumber((v as Vector2).y)

export const clone = (v: Vector2): Vector2 => vector2(v.x, v.y)

export const copy = (v: Vector2, a: Vector2): Vector2 => set(v, a.x, a.y)

export const reset = (v: Vector2): Vector2 => set(v, 0, 0)

export const add = (v: Vector2, a: Vector2, b: Vector2): Vector2 => set(v, a.x + b.x, a.y + b.y)

export const subtract = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, a.x - b.x, a.y - b.y)

export const multiply = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, a.x * b.x, a.y * b.y)

export const divide = (v: Vector2, a: Vector2, b: Vector2): Vector2 => set(v, a.x / b.x, a.y / b.y)

export const ceil = (v: Vector2, a: Vector2): Vector2 => set(v, _ceil(a.x), _ceil(a.y))

export const floor = (v: Vector2, a: Vector2): Vector2 => set(v, _floor(a.x), _floor(a.y))

export const min = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, _min(a.x, b.x), _min(a.y, b.y))

export const max = (v: Vector2, a: Vector2, b: Vector2): Vector2 =>
  set(v, _max(a.x, b.x), _max(a.y, b.y))

export const round = (v: Vector2, a: Vector2): Vector2 => set(v, _round(a.x), _round(a.y))

export const scale = (v: Vector2, a: Vector2, b: number): Vector2 => set(v, a.x * b, a.y * b)

export const scaleAndAdd = (v: Vector2, a: Vector2, b: Vector2, scale: number): Vector2 =>
  set(v, a.x + b.x * scale, a.y + b.y * scale)

export const distance = (a: Vector2, b: Vector2): number => {
  const x = b.x - a.x
  const y = b.y - a.y
  return sqrt(x * x + y * y)
}

export const squaredDistance = (a: Vector2, b: Vector2): number => {
  const x = b.x - a.x
  const y = b.y - a.y
  return x * x + y * y
}

export const length = (a: Vector2): number => sqrt(a.x * a.x + a.y * a.y)

export const squaredLength = (a: Vector2): number => a.x * a.x + a.y * a.y

export const negate = (v: Vector2, a: Vector2): Vector2 => set(v, -a.x, -a.y)

export const inverse = (v: Vector2, a: Vector2): Vector2 => set(v, 1.0 / a.x, 1.0 / a.y)

export const normalize = (v: Vector2, a: Vector2): Vector2 => {
  let len = a.x * a.x + a.y * a.y
  if (len > 0) {
    len = 1 / sqrt(len)
  }

  return set(v, a.x * len, a.y * len)
}

export const dot = (a: Vector2, b: Vector2): number => a.x * b.x + a.y * b.y

export const lerp = (v: Vector2, a: Vector2, b: Vector2, amount: number): Vector2 =>
  set(v, _lerp(a.x, b.x, amount), _lerp(a.y, b.y, amount))

export const transform = (v: Vector2, a: Vector2, m: Matrix2D): Vector2 =>
  set(v, m[0] * a.x + m[2] * a.y + m[4], m[1] * a.x + m[3] * a.y + m[5])

export const rotate = (v: Vector2, a: Vector2, b: Vector2, rad: number): Vector2 => {
  const p0 = a.x - b.x
  const p1 = a.y - b.y
  const s = sin(rad)
  const c = cos(rad)
  return set(v, p0 * c - p1 * s + b.x, p0 * s + p1 * c + b.y)
}

export const angle = (a: Vector2, b: Vector2): number => {
  const m = sqrt((a.x * a.x + a.y * a.y) * (b.x * b.x + b.y * b.y))
  const c = m && (a.x * b.x + a.y * b.y) / m
  return acos(_min(_max(c, -1), 1))
}

export const exactEquals = (a: Vector2, b: Vector2): boolean => a.x === b.x && a.y === b.y

export const equals = (a: Vector2, b: Vector2): boolean =>
  abs(a.x - b.x) <= EPS * _max(1.0, abs(a.x), abs(b.x)) &&
  abs(a.y - b.y) <= EPS * _max(1.0, abs(a.y), abs(b.y))

export const preciseEnough = (v: Vector2): Vector2 => set(v, dp(v.x), dp(v.y))
