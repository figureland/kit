import { isObject } from './guards'

type ValueOf<T> = T[keyof T]
type Entries<T> = [keyof T, ValueOf<T>][]

export const entries = <T extends object>(obj: T): Entries<T> => Object.entries(obj) as Entries<T>

export const keys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[]

export const values = <T extends object>(obj: T) => Object.values(obj) as ValueOf<T>[]

export const assignSame = <T extends object, U extends (T | Partial<T>)[]>(obj: T, ...objs: U) =>
  Object.assign(obj, ...objs)

export const is = <T>(a: T, b: T) => a === b || Object.is(a, b)

export const has = <O extends any, K extends keyof O & any>(o: O, k: K) =>
  Object.prototype.hasOwnProperty.call(o, k as keyof O)

export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

export type Modify<T, R> = Omit<T, keyof R> & R

export const omit = <Item extends object, K extends keyof Item>(
  item: Item,
  props: K[]
): Omit<Item, K> =>
  props.reduce(
    (acc, key) => {
      if (key in acc) {
        delete acc[key]
      }
      return acc
    },
    { ...item }
  )

export const freeze = <T extends object>(obj: T): Readonly<T> => Object.freeze(obj)

export const deepFreeze = <T extends object>(obj: T): Readonly<T> => {
  freeze(obj)
  for (const key in obj) {
    if (isObject(obj[key]) && obj[key] !== null) {
      deepFreeze(obj[key])
    }
  }
  return obj
}

export const extend = <T extends object, X extends object>(obj: T, extensions: X): T & X =>
  freeze({ ...obj, ...extensions })
