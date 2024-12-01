import { isNull, isObject } from './guards'

type ValueOf<T> = T[keyof T]

type Entries<T> = [keyof T, ValueOf<T>][]

export const entries = <T extends object>(obj: T): Entries<T> => Object.entries(obj) as Entries<T>

export const keys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[]

export const values = <T extends object>(obj: T) => Object.values(obj) as ValueOf<T>[]

export const is = <T>(a: T, b: T) => a === b || Object.is(a, b)

export const has = <O extends any, K extends keyof O & any>(o: O, k: K) =>
  Object.prototype.hasOwnProperty.call(o, k as keyof O)

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

export type Modify<T, R> = Omit<T, keyof R> & R

export const omit = <Item extends object, K extends keyof Item>(
  item: Item,
  props: ReadonlyArray<K>
): Omit<Item, K> => {
  const result = { ...item }
  for (const key of props) {
    delete result[key]
  }
  return result
}

export const freeze = <T extends object>(obj: T): Readonly<T> => Object.freeze(obj)

export const deepFreeze = <T extends object>(obj: T): Readonly<T> => {
  freeze(obj)
  for (const key in obj) {
    if (isObject(obj[key]) && !isNull(obj[key])) {
      deepFreeze(obj[key])
    }
  }
  return obj
}

export const isFrozen = <T extends object>(obj: T): boolean => Object.isFrozen(obj)

export const isDeepFrozen = <T extends object>(obj: T): boolean => {
  if (!isFrozen(obj)) return false
  for (const key in obj) {
    if (isObject(obj[key]) && !isNull(obj[key])) {
      if (!isDeepFrozen(obj[key])) return false
    }
  }
  return true
}
