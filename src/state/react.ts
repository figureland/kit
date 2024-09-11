import { useSyncExternalStore } from 'react'
import type { Gettable, GettableType, StateOptions, UseStateDependency } from '../state'
import { state as _state } from '../state'

export const wrap = <S extends Gettable<any>>(s: S) =>
  useSyncExternalStore<GettableType<S>>(s.on, s.get)

export const state = <V>(fn: V | ((use: UseStateDependency) => V), options: StateOptions<V> = {}) =>
  wrap(_state(fn, options))
