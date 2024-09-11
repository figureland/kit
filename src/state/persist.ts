import type { Settable, Gettable, SettableType } from '../state'
import { isArray } from '../ts/guards'

export type StorageAPI<T> = {
  get: () => Promise<T>
  set: (data: T) => Promise<void>
}

export type StorageAPIOptions<T> = {
  name: string | PersistenceName
  validate: ((v: unknown) => Promise<boolean>) | ((v: unknown) => v is T)
  refine?: {
    get: ((v: unknown) => Promise<T>) | ((v: unknown) => T)
    set: ((v: T) => Promise<any>) | ((v: T) => any)
  }
  fallback: T | (() => T) | (() => Promise<T>)
  parse?: (v: string) => T
  stringify?: (v: T) => string
}

export const getStorageName = (n: string | PersistenceName) => (isArray(n) ? n.join('/') : n)

export type PersistenceName = string[]

export const persist = <S extends Gettable<any> & Settable<any>>(
  s: S,
  storage: StorageAPI<SettableType<S>>
) => {
  storage.get().then(s.set)
  s.on((v) => storage.set(v))
  return s
}
