import { isFunction } from '../tools/guards'
import { state } from './state'
import type { State, StateOptions, Struct } from './api'
import { freeze } from '../tools/object'

export const struct = <R extends Record<string, any>>(
  r: R | (() => R),
  options?: StateOptions<R>
): Struct<R> => {
  const baseStruct = structuredClone(isFunction(r) ? r() : r)
  const parent = state<R>(baseStruct, options)
  const states = {} as { [K in keyof R]: State<R[K]> }

  for (const k in baseStruct) {
    states[k] = state(baseStruct[k])
    parent.use(states[k].on(() => parent.set(getObject())))
    parent.use(states[k].dispose)
  }

  const key = <K extends keyof R>(k: K) => states[k]

  const getObject = () => {
    const out = {} as R
    for (const k in baseStruct) {
      out[k] = key(k).get()
    }
    return out
  }

  const set = (v: R | Partial<R> | ((v: R) => R | Partial<R>), sync: boolean = true): void => {
    const u = isFunction(v) ? (v as (v: R) => R)(parent.get()) : v
    for (const k of Object.keys(v)) {
      key(k)?.set(u[k] as R[typeof k], sync)
    }
  }

  return freeze({
    keys: Object.keys(states),
    key,
    set,
    events: parent.events,
    on: parent.on,
    get: parent.get,
    dispose: parent.dispose,
    use: parent.use
  })
}
