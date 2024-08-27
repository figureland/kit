import { signal, type Gettable, type ReadonlySignal, type SettableType } from '.'

export const readonly = <S extends Gettable, T extends SettableType<S>>(
  s: S
): ReadonlySignal<T> => {
  const { on, get, events, dispose, id, use } = s.use(signal<T>((get) => get(s)))

  return {
    on,
    get,
    events,
    dispose,
    id,
    use
  }
}
