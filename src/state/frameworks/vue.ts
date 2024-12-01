import { customRef, onScopeDispose } from 'vue'
import { extend, type Gettable, type GettableType } from '..'

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
