import type {
  State,
  Subscribable,
  SubscribableHistory,
  SubscribableHistoryEntry,
  SubscribableType
} from './api'
import { state, extend } from './state'

export type HistoryOptions = {
  limit?: number
}

export const history = <S extends Subscribable | State<any>>(
  s: S,
  { limit = 50 }: HistoryOptions = {}
): SubscribableHistory<SubscribableHistoryEntry<SubscribableType<S>>[]> => {
  const store = state<SubscribableHistoryEntry<SubscribableType<S>>[]>(() => [])

  s.events.on('previous', (e) => {
    store.mutate((s) => {
      s.push(e)
      if (s.length > limit) s.shift()
    })
  })

  // option 1
  const restore = (n: number = -1) => {
    if ('set' in s) {
      const last = store.get()[store.get().length + n]
      if (last) s.set(last[1])
    }
  }

  return extend(store, {
    restore
  })
}
