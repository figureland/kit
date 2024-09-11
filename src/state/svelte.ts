import type { Gettable, GettableType, StateOptions, UseStateDependency } from '../state'
import { state as _state } from '../state'
export const wrap = <S extends Gettable<any>>(s: S) => ({
  ...s,
  subscribe: (run: (value: GettableType<S>) => void) => {
    const unsub = s.on(run)
    run(s.get())
    return unsub
  }
})

export const state = <V>(fn: V | ((use: UseStateDependency) => V), options: StateOptions<V> = {}) =>
  wrap(_state(fn, options))
