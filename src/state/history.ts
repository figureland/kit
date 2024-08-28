import {
  Signal,
  Subscribable,
  SubscribableHistory,
  SubscribableHistoryEntry,
  SubscribableType
} from './api'
import { signal } from './signal'

export type HistoryOptions = {
  limit?: number
}

export const history = <S extends Subscribable | Signal<any>>(
  s: S,
  { limit = 50 }: HistoryOptions = {}
): SubscribableHistory<SubscribableHistoryEntry<SubscribableType<S>>[]> => {
  const state = signal<SubscribableHistoryEntry<SubscribableType<S>>[]>(() => [])

  s.events.on('previous', (e) => {
    state.mutate((s) => {
      s.push(e)
      if (s.length > limit) s.shift()
    })
  })

  const restore = (n: number = -1) => {
    if ('set' in s) {
      const last = state.get()[state.get().length + n]
      if (last) s.set(last[1])
    }
  }

  return {
    ...state,
    restore
  }
}
