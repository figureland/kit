import type { State, StateOptions, SubscribableEvents, UseStateDependency } from './api'
import type { Subscription } from './subscriptions'
import { isFunction, isObject, isMap, isSet, simpleMerge, simpleEquals } from '../tools'
import { events } from './events'
import { store } from './store'
import { freeze } from '../tools/object'

/**
 * Creates a simple {@link State} for tracking a value
 */
export const state = <V>(
  initial: V | ((use: UseStateDependency) => V),
  { merge = simpleMerge, equality = simpleEquals, throttle }: StateOptions<V> = {}
): State<V> => {
  const { dispose, use } = store()
  const dependencies = new Set<State<any>['on']>()

  const e = use(events<SubscribableEvents<V>>())
  let loaded = false
  let lastSyncTime: number = 0
  let hasEmitted = false
  let throttleTimeoutId: number | undefined

  const shouldThrottle = () => {
    return throttle !== undefined && hasEmitted && performance.now() - lastSyncTime < throttle
  }

  const scheduleThrottledEmit = () => {
    if (throttle === undefined || throttleTimeoutId !== undefined) return
    
    const timeToWait = throttle - (performance.now() - lastSyncTime)
    throttleTimeoutId = setTimeout(() => {
      throttleTimeoutId = undefined
      lastSyncTime = performance.now()
      e.emit('state', value)
    }, Math.max(0, timeToWait))
  }

  const handleDependency: UseStateDependency = (s) => {
    if (!loaded) dependencies.add(s.on)
    return s.get()
  }

  let value = isFunction(initial) ? initial(handleDependency) : initial

  loaded = true

  const mutate = (u: (value: V) => void, sync: boolean = true) => {
    // Always execute the mutation, even when throttling
    u(value)

    // Skip emission if we're throttling
    if (shouldThrottle()) return

    if (sync) {
      e.emit('state', value)
      lastSyncTime = performance.now()
      hasEmitted = true
    }
  }

  const set = (v: V | Partial<V> | ((v: V) => V | Partial<V>), forceSync?: boolean): void => {
    // Always calculate the new value, even when throttling
    const next = isFunction(v) ? (v as (v: V) => V)(value) : v
    const shouldMerge = isObject(next) && !isMap(next) && !isSet(next)
    const newValue = shouldMerge && isObject(value) ? (merge(value, next) as V) : (next as V)

    // Skip emission but still update the value if we're throttling
    if (shouldThrottle()) {
      value = newValue
      scheduleThrottledEmit()
      return
    }

    if (forceSync || !equality || !equality(value, newValue)) {
      // Clear any pending throttled emit since we're emitting now
      if (throttleTimeoutId !== undefined) {
        clearTimeout(throttleTimeoutId)
        throttleTimeoutId = undefined
      }
      
      lastSyncTime = performance.now()
      e.emit('previous', [lastSyncTime, value])
      value = newValue
      e.emit('state', value)
      hasEmitted = true
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
      if (throttleTimeoutId !== undefined) {
        clearTimeout(throttleTimeoutId)
        throttleTimeoutId = undefined
      }
      e.emit('dispose', undefined)
      dependencies.clear()
      dispose()
    },
    use
  }
}

export const extend = <T extends object, X extends object>(obj: T, extensions: X): T & X =>
  freeze({ ...obj, ...extensions })
