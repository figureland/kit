import type { Gettable, GettableType } from '../state'

export const useSubscribable = <S extends Gettable<any>>(s: S) => ({
  subscribe: (run: (value: GettableType<S>) => void) => {
    const unsub = s.on(run)
    run(s.get())
    return unsub
  }
})
