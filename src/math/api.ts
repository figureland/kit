import type Big from 'big.js'
import type { RoundingMode } from 'big.js'
import type { Gettable } from '../state'

export type Vector2 = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Box = Vector2 & Size

export type Matrix2D = [number, number, number, number, number, number]

export type Easing = (x: number) => number

export type CubicBezier2D = [Vector2, Vector2, Vector2, Vector2]

export type QuadraticBezier2D = [Vector2, Vector2, Vector2]

export type Decimal = Gettable<string> & {
  set: (v: string | number | Big) => void
  abs: () => string
  plus: (n: string | number | Big) => string
  minus: (n: string | number | Big) => string
  times: (n: string | number | Big) => string
  div: (n: string | number | Big) => string
  pow: (n: number) => string
  round: (dp?: number, rm?: RoundingMode) => string
  eq: (n: string | number | Big) => boolean
  gt: (n: string | number | Big) => boolean
  lt: (n: string | number | Big) => boolean
  gte: (n: string | number | Big) => boolean
  lte: (n: string | number | Big) => boolean
  sqrt: () => string
  mod: (n: string | number | Big) => string
  neg: () => string
  toNumber: () => number
  toString: () => string
  toPrecision: (dp: number) => string
  instance: () => Big
}
