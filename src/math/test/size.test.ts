import { test, describe, expect } from 'bun:test'
import {
  size,
  isSize,
  clone,
  copy,
  reset,
  resize,
  equals,
  add,
  scale,
  subtract,
  multiply,
  divide,
  fit
} from '../size'

describe('Size', () => {
  test('size creates a size object', () => {
    const s = size(100, 150)
    expect(s).toEqual({ width: 100, height: 150 })
  })

  test('isSize validates size objects', () => {
    expect(isSize({ width: 10, height: 10 })).toBe(true)
    expect(isSize({ width: '10', height: 10 })).toBe(false)
  })

  test('clone creates an exact copy of a size object', () => {
    const s = size(30, 45)
    const cloned = clone(s)
    expect(cloned).toEqual(s)
    expect(cloned).not.toBe(s)
  })

  test('copy copies properties from one size to another', () => {
    const s1 = size(50, 75)
    const s2 = size(20, 30)
    copy(s1, s2)
    expect(s1).toEqual(s2)
  })

  test('reset sets size dimensions to zero', () => {
    const s = size(100, 200)
    reset(s)
    expect(s).toEqual({ width: 0, height: 0 })
  })
  test('resize changes the size dimensions', () => {
    const s = size()
    resize(s, 120, 240)
    expect(s).toEqual({ width: 120, height: 240 })
  })

  test('equals checks if two sizes are equal', () => {
    const s1 = size(30, 60)
    const s2 = size(30, 60)
    const s3 = size(60, 120)
    expect(equals(s1, s2)).toBe(true)
    expect(equals(s1, s3)).toBe(false)
  })

  test('add adds dimensions of two sizes', () => {
    const s1 = size(10, 20)
    const s2 = size(30, 40)
    add(s1, s2)
    expect(s1).toEqual({ width: 40, height: 60 })
  })

  test('scale multiplies the size dimensions by a number', () => {
    const s = size(10, 15)
    scale(s, 2)
    expect(s).toEqual({ width: 20, height: 30 })
  })

  test('subtract subtracts dimensions of two sizes', () => {
    const s1 = size(40, 80)
    const s2 = size(10, 20)
    subtract(s1, s2)
    expect(s1).toEqual({ width: 30, height: 60 })
  })

  test('multiply multiplies dimensions of two sizes', () => {
    const s1 = size(4, 5)
    const s2 = size(2, 3)
    multiply(s1, s2)
    expect(s1).toEqual({ width: 8, height: 15 })
  })

  test('divide divides dimensions of two sizes', () => {
    const s1 = size(40, 60)
    const s2 = size(2, 3)
    divide(s1, s2)
    expect(s1).toEqual({ width: 20, height: 20 })
  })

  test('fit fits an item into a container maintaining aspect ratio', () => {
    const item = size(1200, 1600)
    const container = size(800, 800)
    const fitted = fit(item, container)
    expect(fitted).toEqual({ width: 600, height: 800 })
  })

  test('does not change an item that is smaller than container', () => {
    const item = size(400, 200)
    const container = size(800, 800)
    const fitted = fit(item, container)
    expect(fitted).toEqual({ width: 400, height: 200 })
  })
})
