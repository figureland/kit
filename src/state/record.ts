import { isFunction } from '../type/guards'
import { keys } from '../type/object'
import { type SignalOptions, signal } from './signal'
import type { Signal, SignalRecord } from './api'

export const record = <R extends Record<string, any>>(
  r: R,
  options?: SignalOptions<R>
): SignalRecord<R> => {
  const parent = signal<R>(structuredClone(r), options)
  const signals = {} as { [K in keyof R]: Signal<R[K]> }

  for (const k in r) {
    signals[k] = signal(r[k])
    parent.use(signals[k].on(() => parent.set(getObject())))
    parent.use(signals[k].dispose)
  }

  const key = <K extends keyof R>(k: K) => signals[k]

  const getObject = () => {
    const out = {} as R
    for (const k in r) {
      out[k] = key(k).get()
    }
    return out
  }

  const set = (v: R | Partial<R> | ((v: R) => R | Partial<R>), sync: boolean = true): void => {
    const u = isFunction(v) ? (v as (v: R) => R)(parent.get()) : v
    for (const k of keys(v)) {
      key(k)?.set(u[k] as R[typeof k], sync)
    }
  }

  return {
    id: parent.id,
    keys: keys(signals),
    key,
    set,
    events: parent.events,
    on: parent.on,
    get: parent.get,
    dispose: parent.dispose,
    use: parent.use
  }
}
