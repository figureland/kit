import type Big from 'big.js'
import type { RoundingMode } from 'big.js'
import type { Gettable } from '../state'

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
