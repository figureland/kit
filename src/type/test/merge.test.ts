import { describe, it, expect } from 'bun:test'
import { simpleMerge } from '../merge'

describe('simpleMerge', () => {
  it('merges two flat objects with primitive values', () => {
    const objA = { a: 1, b: 2 }
    const objB = { b: 3, c: 4 }
    const merged = simpleMerge(objA, objB)
    expect(merged).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('handles undefined properties without errors', () => {
    const objA = { a: 1, b: undefined }
    const objB = { b: 2 }
    const merged = simpleMerge(objA, objB)
    expect(merged).toEqual({ a: 1, b: 2 })
  })

  it('overrides nested objects by default', () => {
    const objA = { a: { x: 1, y: 2 } }
    const objB = { a: { y: 3, z: 4 }, b: 5 }
    const merged = simpleMerge(objA, objB)
    expect(merged).toEqual({ a: { y: 3, z: 4 }, b: 5 })
  })

  it('merges arrays by replacing the original array', () => {
    const objA = { a: [1, 2, 3] }
    const objB = { a: [4, 5] }
    const merged = simpleMerge(objA, objB)
    expect(merged.a).toEqual([4, 5])
  })

  it('correctly handles merging with partial types', () => {
    const objA = { a: 1, b: 2 }
    const objB = { b: 3 }
    const merged = simpleMerge(objA, objB)
    expect(merged).toEqual({ a: 1, b: 3 })
  })
})
