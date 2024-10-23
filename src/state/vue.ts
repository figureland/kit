import { customRef, onScopeDispose } from 'vue'
import type { Gettable, GettableType, StateOptions, UseStateDependency } from '../state'
import { state as _state } from '../state'
import { extend } from '../tools/object'

export const vue = <S extends Gettable<any>>(s: S) =>
  customRef<GettableType<S>>((track, set) => {
    const dispose = s.on(set)
    onScopeDispose(dispose)
    return extend(s, {
      get: () => {
        track()
        return s.get()
      },
      set,
      dispose
    })
  })

export const state = <V>(fn: V | ((use: UseStateDependency) => V), options: StateOptions<V> = {}) =>
  vue(_state(fn, options))
