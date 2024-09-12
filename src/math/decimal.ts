import Big, { type RoundingMode } from 'big.js'
import { state } from '../state'
import { extend } from '../ts/object'
import type { Decimal } from './api'

export const decimal = <V extends string | number | Big>(fn: V): Decimal => {
  const store = {
    value: new Big(fn)
  }

  const s = state(store.value.valueOf())

  const set = (v: string | number | Big) => {
    try {
      store.value = new Big(v)
      s.set(store.value.valueOf())
    } catch {
      console.error('Invalid decimal value', v)
    }
  }

  return extend(s, {
    set,
    abs: () => store.value.abs().valueOf(),
    plus: (n: string | number | Big) => store.value.plus(n).valueOf(),
    minus: (n: string | number | Big) => store.value.minus(n).valueOf(),
    times: (n: string | number | Big) => store.value.times(n).valueOf(),
    div: (n: string | number | Big) => store.value.div(n).valueOf(),
    pow: (n: number) => store.value.pow(n).valueOf(),
    neg: () => store.value.neg().valueOf(),
    round: (dp?: number, rm?: RoundingMode) => store.value.round(dp, rm).valueOf(),
    eq: (n: string | number | Big) => store.value.eq(n),
    gt: (n: string | number | Big) => store.value.gt(n),
    lt: (n: string | number | Big) => store.value.lt(n),
    gte: (n: string | number | Big) => store.value.gte(n),
    lte: (n: string | number | Big) => store.value.lte(n),
    sqrt: () => store.value.sqrt().valueOf(),
    mod: (n: string | number | Big) => store.value.mod(n).valueOf(),
    toNumber: () => store.value.toNumber(),
    toString: () => store.value.toString(),
    toPrecision: (dp: number) => store.value.toPrecision(dp),
    instance: () => store.value
  })
}

export const isBig = (v: any): v is Big => v instanceof Big
