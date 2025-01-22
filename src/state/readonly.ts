import { freeze } from '../tools/object'
import type { Gettable, ReadonlyState, SettableType } from './api'
import { state } from './state'

export const readonly = <S extends Gettable, T extends SettableType<S>>(s: S): ReadonlyState<T> => {
  const clone = s.use(state<T>((get) => get(s)))

  return freeze({
    on: clone.on,
    get: clone.get,
    events: clone.events,
    dispose: clone.dispose,
    use: clone.use
  })
}
