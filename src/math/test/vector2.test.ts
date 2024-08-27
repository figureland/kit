import { describe, test, expect } from 'bun:test'
import {
  vector2,
  add,
  subtract,
  multiply,
  length,
  normalize,
  dot,
  clone,
  reset,
  equals
} from '../vector2'

describe('Vector2 operations', () => {
  test('create Matrix2', () => {
    expect(vector2()).toEqual({ x: 0, y: 0 })
  })

  test('create Matrix2 with arguments', () => {
    expect(vector2(1, 2)).toEqual({ x: 1, y: 2 })
  })

  test('creates Matrix2 as a new instance', () => {
    const v1 = { x: 1, y: 2 }
    const v = vector2(v1.x, v1.y)
    expect(v1).not.toBe(v)
  })

  test('add two vectors', () => {
    const v1 = vector2(1, 2)
    const v2 = vector2(3, 4)
    const result = add(vector2(), v1, v2)
    expect(result).toEqual({ x: 4, y: 6 })
  })

  test('subtract two vectors', () => {
    const v1 = vector2(5, 6)
    const v2 = vector2(2, 4)
    const result = subtract(vector2(), v1, v2)
    expect(result).toEqual({ x: 3, y: 2 })
  })

  test('multiply two vectors', () => {
    const v1 = vector2(1, 2)
    const v2 = vector2(3, 4)
    const result = multiply(vector2(), v1, v2)
    expect(result).toEqual({ x: 3, y: 8 })
  })

  test('length of a vector', () => {
    const v = vector2(3, 4)
    const result = length(v)
    expect(result).toBe(5) // As sqrt(3^2 + 4^2) = 5
  })

  test('normalize a vector', () => {
    const v = vector2(4, 0)
    const result = normalize(vector2(), v)
    expect(result).toEqual({ x: 1, y: 0 }) // Normalized vector of [4, 0] is [1, 0]
  })

  test('dot product of two vectors', () => {
    const v1 = vector2(1, 3)
    const v2 = vector2(4, 2)
    const result = dot(v1, v2)
    expect(result).toBe(10) // 1*4 + 3*2
  })

  test('clone a vector', () => {
    const v = vector2(7, 9)
    const result = clone(v)
    expect(result).toEqual({ x: 7, y: 9 })
    expect(result).not.toBe(v)
  })

  test('reset a vector', () => {
    const v = vector2(10, 15)
    const result = reset(v)
    expect(result).toEqual({ x: 0, y: 0 })
  })

  test('equality check with epsilon', () => {
    const test1 = equals(vector2(1.0, 1.000002), vector2(1.0, 1.000003))
    expect(test1).toBe(true)

    const test2 = equals(vector2(1.0, 1.000001), vector2(1.0, 1.000001))
    expect(test2).toBe(true)

    const test3 = equals(vector2(1.0, 1.000001), vector2(1.0, 1.00001))
    expect(test3).toBe(false)
  })

  test('normalize a vector to unit length', () => {
    const v = vector2(3, 4)
    const normalizedV = normalize(vector2(), v)
    const expectedLength = 1
    const resultantLength = length(normalizedV)
    expect(resultantLength).toBeCloseTo(expectedLength)
    expect(normalizedV.x).toBeCloseTo(0.6, 10)
    expect(normalizedV.y).toBeCloseTo(0.8, 10)
  })
})
