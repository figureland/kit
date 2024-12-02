import { has, is, keys } from './object'
import { isArray, isMap, isNull, isObject } from './guards'

export type Equals<T extends any = any> = (a: T, b: T) => boolean

export const simpleEquals: Equals = (a, b) => is(a, b)

export const shallowEquals: Equals = (a, b) => {
  if (!a || !b) {
    return false
  }

  if (simpleEquals(a, b)) {
    return true
  }

  if (!isObject(a) || isNull(a) || !isObject(b) || isNull(b)) {
    return false
  }

  if (isMap(a) || isMap(b)) {
    return false
  }

  const keys1 = keys(a)
  const keys2 = keys(b)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!has(b, key) || a[key] !== b[key]) {
      return false
    }
  }

  return true
}

export const arraysEquals: Equals<any[]> = (arr1, arr2) => {
  if (!arr1 || !arr2) {
    return false
  }

  if (!isArray(arr1) || !isArray(arr2)) {
    return false
  }

  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}
