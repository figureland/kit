import { customRef, onScopeDispose } from 'vue'
import type { Gettable, GettableType } from '../state'

export const useSubscribable = <S extends Gettable<any>>(s: S) =>
  customRef<GettableType<S>>((track, set) => {
    const unsubscribe = s.on(set)
    onScopeDispose(() => {
      unsubscribe()
    })
    return {
      get: () => {
        track()
        return s.get()
      },
      set: () => {},
      dispose: unsubscribe
    }
  })
