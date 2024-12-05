import { isFunction } from '../tools/guards'
import { state } from './state'
import type { State, StateOptions, Shape } from './api'

export const shape = <R extends Record<string, any>>(r: R, options?: StateOptions<R>): Shape<R> => {
  const parent = state<R>(structuredClone(r), options)
  const states = {} as { [K in keyof R]: State<R[K]> }

  for (const k in r) {
    states[k] = state(r[k])
    parent.use(states[k].on(() => parent.set(getObject())))
    parent.use(states[k].dispose)
  }

  const key = <K extends keyof R>(k: K) => states[k]

  const getObject = () => {
    const out = {} as R
    for (const k in r) {
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

  return {
    keys: Object.keys(states),
    key,
    set,
    events: parent.events,
    on: parent.on,
    get: parent.get,
    dispose: parent.dispose,
    use: parent.use
  }
}
