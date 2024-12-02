import { describe, expect, it } from 'bun:test'
import { shallowEquals, simpleEquals } from '../equals'

describe('simpleEquals', () => {
  it('should handle primitive values', () => {
    expect(simpleEquals(1, 1)).toBe(true)
    expect(simpleEquals('a', 'a')).toBe(true)
    expect(simpleEquals(true, false)).toBe(false)
  })

  it('should compare objects and arrays by reference', () => {
    const obj = { key: 'value' }
    const arr = [1, 2, 3]
    expect(simpleEquals(obj, obj)).toBe(true)
    expect(simpleEquals(arr, arr)).toBe(true)
    expect(simpleEquals(obj, { key: 'value' })).toBe(false)
    expect(simpleEquals(arr, [1, 2, 3])).toBe(false)
  })

  it('should correctly handle null and undefined', () => {
    expect(simpleEquals(null, null)).toBe(true)
    expect(simpleEquals(undefined, undefined)).toBe(true)
    expect(simpleEquals(null, undefined)).toBe(false)
  })
})

describe('shallowEquals', () => {
  it('should return false if either argument is null or undefined', () => {
    expect(shallowEquals(null, {})).toBe(false)
    expect(shallowEquals({}, undefined)).toBe(false)
  })

  it('should return true for two empty objects', () => {
    expect(shallowEquals({}, {})).toBe(true)
  })

  it('should return true for identical objects', () => {
    const obj = { key: 'value', num: 123 }
    expect(shallowEquals(obj, obj)).toBe(true)
  })

  it('should return false for objects with different numbers of keys', () => {
    const obj1 = { key1: 'value', key2: 'another' }
    const obj2 = { key1: 'value' }
    expect(shallowEquals(obj1, obj2)).toBe(false)
  })

  it('should return false for objects with the same keys but different values', () => {
    const obj1 = { key: 'value' }
    const obj2 = { key: 'another' }
    expect(shallowEquals(obj1, obj2)).toBe(false)
  })

  it('should return true for objects with the same keys in different orders', () => {
    const obj1 = { key1: 'value', key2: 'value' }
    const obj2 = { key2: 'value', key1: 'value' }
    expect(shallowEquals(obj1, obj2)).toBe(true)
  })

  it('should handle objects with nested structures identically', () => {
    const obj1 = { key: { innerKey: 'value' } }
    const obj2 = { key: { innerKey: 'value' } }
    expect(shallowEquals(obj1, obj2)).toBe(false)
  })

  it('should compare non-object types', () => {
    expect(shallowEquals(1, 1)).toBe(true)
    expect(shallowEquals('a', 'a')).toBe(true)
    expect(shallowEquals(true, true)).toBe(true)
  })

  it('should return false when comparing an object to a primitive', () => {
    expect(shallowEquals({}, 1)).toBe(false)
    expect(shallowEquals('a', {})).toBe(false)
  })

  it('should handle special types like Maps correctly', () => {
    const map1 = new Map([['key', 'value']])
    const map2 = new Map([['key', 'value']])
    expect(shallowEquals(map1, map2)).toBe(false)
  })
})
