import { customRef, onScopeDispose } from 'vue'
import type { Gettable, GettableType } from '..'
import { extend } from '../../tools/object'

export const vue = <S extends Gettable<any>>(s: S) =>
  customRef<GettableType<S>>((track, set) => {
    const dispose = s.on(set)
    onScopeDispose(dispose)
    return extend(s, {
      get: () => {
        track()
        return s.get()
      },
      set,
      dispose
    })
  })
