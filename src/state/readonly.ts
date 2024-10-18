import type { Gettable, ReadonlyState, SettableType } from './api'
import { state } from './state'

export const readonly = <S extends Gettable, T extends SettableType<S>>(
  s: S
): ReadonlyState<T> => {
  const { on, get, events, dispose, id, use } = s.use(state<T>((get) => get(s)))

  return {
    on,
    get,
    events,
    dispose,
    id,
    use
  }
}
