import { has, is, keys } from './object'
import { isArray, isNull, isObject } from './guards'

export type Equals<T extends any = any> = (s: T, t: T) => boolean

export const simpleEquals: Equals = (state, prevState) => is(state, prevState)

export const shallowEquals: Equals = (obj1, obj2) => {
  if (!obj1 || !obj2) {
    return false
  }

  if (simpleEquals(obj1, obj2)) {
    return true
  }

  if (!isObject(obj1) || isNull(obj1) || !isObject(obj2) || isNull(obj2)) {
    return false
  }

  const keys1 = keys(obj1)
  const keys2 = keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (!has(obj2, key) || obj1[key] !== obj2[key]) {
      return false
    }
  }

  if (obj1 instanceof Map && obj2 instanceof Map) {
    return false
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
