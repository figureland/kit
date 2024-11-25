import type { Gettable, GettableType } from '..'
import { extend } from '../../tools/object'

export const svelte = <S extends Gettable<any>>(s: S) =>
  extend(s, {
    subscribe: (run: (value: GettableType<S>) => void) => {
      const unsub = s.on(run)
      run(s.get())
      return unsub
    }
  })
