import { entries } from '../../ts/object'
import { isString, isNumber, isSymbol } from '../../ts/guards'
import { createSubscriptions, createTopicSubscriptions, type Subscription } from './subscriptions'
import type { EventsKey, EventsMap, Events } from '../api'

/**
 * Creates a new event emitter
 */
export const events = <
  S extends EventsMap,
  K extends EventsKey & keyof S = EventsKey & keyof S
>(): Events<S, K> => {
  const subs = createTopicSubscriptions<K>()
  const allSubs = createSubscriptions<Subscription<[K, S[K]]>>()

  /**
   * Subscribe to a specific event, to all events using '*', or to multiple events
   */
  const on: Events<S, K>['on'] = (key, sub) => {
    if (isString(key) || isSymbol(key) || isNumber(key)) {
      return subs.add(key as K, sub as Subscription<S[typeof key]>)
    } else {
      const listeners = key as Partial<{ [Key in K]: (eventArg: S[Key]) => void }>
      const unsubscribes = (entries(listeners) as [K, (eventArg: S[K]) => void][]).map((listener) =>
        subs.add(listener[0], listener[1])
      )
      return () => {
        for (const unsubscribe of unsubscribes) {
          unsubscribe()
        }
      }
    }
  }

  const all = (sub: Subscription<[K, S[K]]>) => {
    return allSubs.add(sub)
  }

  return {
    on,
    emit: <Key extends K>(key: Key, value: S[Key]) => {
      subs.each(key, value)
      allSubs.each([key, value])
    },
    all,
    dispose: () => {
      allSubs.dispose()
      subs.dispose()
    },
    size: () => {
      return allSubs.size() + subs.size()
    }
  }
}
