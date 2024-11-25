import { isFunction, isObject, isMap, isSet, shallowEquals, simpleMerge } from '../tools'
import type { Subscription } from './subscriptions'
import { events } from './events'
import type { State, StateOptions, SubscribableEvents, UseStateDependency } from './api'
import { lifecycle } from './lifecycle'

/**
 * Creates a simple {@link State} for tracking a value
 */
export const state = <V>(
  initial: V | ((use: UseStateDependency) => V),
  { merge = simpleMerge, equality = shallowEquals, throttle, track = false }: StateOptions<V> = {}
): State<V> => {
  const { dispose, use } = lifecycle()
  const dependencies = new Set<State<any>['on']>()

  const e = use(events<SubscribableEvents<V>>())
  let loaded = track
  let lastSyncTime: number = 0

  const shouldThrottle = () => throttle && performance.now() - lastSyncTime < throttle

  const handleDependency: UseStateDependency = (s) => {
    if (!loaded) dependencies.add(s.on)
    return s.get()
  }

  let value = isFunction(initial) ? initial(handleDependency) : initial

  loaded = true

  const mutate = (u: (value: V) => void, sync: boolean = true) => {
    if (shouldThrottle()) return
    u(value)
    if (sync) e.emit('state', value)
    lastSyncTime = performance.now()
  }

  const set = (v: V | Partial<V> | ((v: V) => V | Partial<V>), forceSync?: boolean): void => {
    if (shouldThrottle()) return
    const next = isFunction(v) ? (v as (v: V) => V)(value) : v
    const shouldMerge = isObject(next) && !isMap(next) && !isSet(next)
    const newValue = shouldMerge && isObject(value) ? (merge(value, next) as V) : (next as V)
    if (!equality || !equality(value, newValue) || forceSync) {
      lastSyncTime = performance.now()
      value = newValue
      e.emit('state', value)
      e.emit('previous', [lastSyncTime, value])
    }
  }

  if (isFunction(initial)) {
    for (const dep of dependencies) {
      dep(() => set(initial(handleDependency)))
    }
  }

  const on = (sub: Subscription<V>) => e.on('state', sub)

  return {
    set,
    on,
    mutate,
    get: () => value,
    events: e,
    dispose: () => {
      e.emit('dispose', true)
      dependencies.clear()
      dispose()
    },
    use
  }
}
