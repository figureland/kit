import { describe, it, expect } from 'bun:test'
import { entries, keys, values, is, has, omit } from '../object'

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

  it('has should verify if an object has a property', () => {
    const obj = { key: 'value' }
    expect(has(obj, 'key')).toBe(true)
    expect(has(obj, 'nonexistent')).toBe(false)
  })

  it('omit should return a new object without the specified properties', () => {
    const original = { a: 1, b: 2, c: 3, d: 4 }
    const result = omit(original, ['b', 'd'])

    expect(result).toEqual({ a: 1, c: 3 })
    expect(original).toEqual({ a: 1, b: 2, c: 3, d: 4 }) // Ensure original object is not modified
    expect(result).not.toBe(original) // Ensure a new object is returned

    const resultWithNonExistent = omit(original, ['b'])
    expect(resultWithNonExistent).toEqual({ a: 1, c: 3, d: 4 })
  })
})
