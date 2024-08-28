import { describe, it, expect } from 'bun:test'
import { entries, keys, values, is, has, assignSame } from '../object'

describe('Object Utility Functions', () => {
  const testObj = {
    id: 1,
    name: 'Test',
    active: true
  }

  it('entries should return all entries of an object', () => {
    const result = entries(testObj)
    expect(result).toEqual([
      ['id', 1],
      ['name', 'Test'],
      ['active', true]
    ])
  })

  it('keys should return all keys of an object', () => {
    const result = keys(testObj)
    expect(result).toEqual(['id', 'name', 'active'])
  })

  it('values should return all values of an object', () => {
    const result = values(testObj)
    expect(result).toEqual([1, 'Test', true])
  })

  it('assign should merge multiple objects into the first one', () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const obj3 = { b: 4 }
    const obj4 = { c: 4 }
    const res = assignSame({}, obj1, obj2, obj3, obj4)
    expect(res).toEqual({ a: 1, b: 4, c: 4 })
  })

  it('is should correctly compare two values', () => {
    expect(is(5, 5)).toBe(true)
    expect(is('test', 'test')).toBe(true)
    expect(is({}, {})).toBe(false) // Different references
    expect(is(NaN, NaN)).toBe(true) // Same value, special case
  })

  it('has should verify if an object has a property', () => {
    const obj = { key: 'value' }
    expect(has(obj, 'key')).toBe(true)
    expect(has(obj, 'nonexistent')).toBe(false)
  })
})
