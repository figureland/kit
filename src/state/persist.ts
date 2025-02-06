import type { Settable, Gettable, SettableType } from '../state'

export type StorageAPI<T> = {
  get: () => Promise<T>
  set: (data: T) => Promise<void>
}

export type StorageAPIOptions<T> = {
  name: string
  validate?: ((v: unknown) => Promise<boolean>) | ((v: unknown) => v is T)
  fallback: T | (() => T) | (() => Promise<T>)
  refine?: {
    get: ((v: unknown) => Promise<T>) | ((v: unknown) => T)
    set: ((v: T) => Promise<any>) | ((v: T) => any)
  }
}

export const persist = <S extends Gettable<any> & Settable<any>>(
  s: S,
  storage: StorageAPI<SettableType<S>>
) => {
  storage.get().then(s.set)
  s.on((v) => storage.set(v))
  return s
}
