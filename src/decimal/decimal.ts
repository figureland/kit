import Big, { type RoundingMode } from 'big.js'
import { state } from '../state'
import type { Decimal } from './api'

export const decimal = <V extends string | number | Big>(fn: V): Decimal => {
  const v = new Big(fn)
  const s = state(v.valueOf())

  const set = (v: string | number | Big) => {
    try {
      const result = new Big(v)
      s.set(result.valueOf())
    } catch {
      console.error('Invalid decimal value', v)
    }
  }

  return {
    ...s,
    set,
    abs: () => v.abs().valueOf(),
    plus: (n: string | number | Big) => v.plus(n).valueOf(),
    minus: (n: string | number | Big) => v.minus(n).valueOf(),
    times: (n: string | number | Big) => v.times(n).valueOf(),
    div: (n: string | number | Big) => v.div(n).valueOf(),
    pow: (n: number) => v.pow(n).valueOf(),
    round: (dp?: number, rm?: RoundingMode) => v.round(dp, rm).valueOf(),
    eq: (n: string | number | Big) => v.eq(n),
    gt: (n: string | number | Big) => v.gt(n),
    lt: (n: string | number | Big) => v.lt(n),
    gte: (n: string | number | Big) => v.gte(n),
    lte: (n: string | number | Big) => v.lte(n),
    sqrt: () => v.sqrt().valueOf(),
    mod: (n: string | number | Big) => v.mod(n).valueOf(),
    neg: () => v.neg().valueOf(),
    toNumber: () => v.toNumber(),
    toString: () => v.toString(),
    toPrecision: (dp: number) => v.toPrecision(dp),
    instance: () => v
  }
}

export const isBig = (v: any): v is Big => v instanceof Big
