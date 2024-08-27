import { describe, test, expect } from 'bun:test'
import {
  matrix2D,
  clone,
  identity,
  copy,
  invert,
  determinant,
  multiply,
  rotate,
  scale,
  translate,
  fromRotation,
  fromScaling,
  fromTranslation,
  add,
  subtract,
  multiplyScalar,
  equals
} from '../matrix2D'
import { vector2 } from '../vector2'

describe('Matrix2D operations', () => {
  test('create default Matrix2D', () => {
    expect(matrix2D()).toEqual([1, 0, 0, 1, 0, 0])
  })

  test('clone a Matrix2D', () => {
    const m = matrix2D(2, 3, 4, 5, 6, 7)
    const cloned = clone(m)
    expect(cloned).toEqual([2, 3, 4, 5, 6, 7])
    expect(cloned).not.toBe(m)
  })

  test('identity matrix', () => {
    const m = matrix2D()
    identity(m)
    expect(m).toEqual([1, 0, 0, 1, 0, 0])
  })

  test('copy matrix', () => {
    const m1 = matrix2D(2, 3, 4, 5, 6, 7)
    const m2 = matrix2D()
    copy(m2, m1)
    expect(m2).toEqual([2, 3, 4, 5, 6, 7])
  })

  test('invert matrix', () => {
    const m = matrix2D(1, 2, 3, 4, 5, 6)
    const inverted = invert(matrix2D(), m)
    expect(determinant(m)).not.toBe(0) // Ensure matrix is invertible
    expect(inverted).toEqual([-2, 1, 1.5, -0.5, 1, -2])
  })

  test('determinant of a matrix', () => {
    const m = matrix2D(1, 2, 3, 4, 5, 6)
    expect(determinant(m)).toBe(-2)
  })

  test('multiply two matrices', () => {
    const m1 = matrix2D(1, 2, 3, 4, 5, 6)
    const m2 = matrix2D(7, 8, 9, 10, 11, 12)
    const result = multiply(matrix2D(), m1, m2)
    expect(result).toEqual([31, 46, 39, 58, 52, 76])
  })

  test('rotate matrix', () => {
    const m = matrix2D()
    const rad = Math.PI / 4 // 45 degrees
    const rotated = rotate(matrix2D(), m, rad)
    expect(rotated[0]).toBeCloseTo(Math.cos(rad))
    expect(rotated[1]).toBeCloseTo(Math.sin(rad))
  })

  test('scale matrix', () => {
    const m = matrix2D()
    const scaled = scale(matrix2D(), m, vector2(2, 3))
    expect(scaled).toEqual([2, 0, 0, 3, 0, 0])
  })

  test('translate matrix', () => {
    const m = matrix2D()
    const translated = translate(matrix2D(), m, vector2(1, 2))
    expect(translated).toEqual([1, 0, 0, 1, 1, 2])
  })

  test('from rotation matrix', () => {
    const rad = Math.PI / 2
    const m = fromRotation(matrix2D(), rad)
    expect(m[0]).toBeCloseTo(0)
    expect(m[1]).toBe(1)
    expect(m[2]).toBe(-1)
    expect(m[3]).toBeCloseTo(0)
  })

  test('from scaling matrix', () => {
    const m = fromScaling(matrix2D(), vector2(2, 3))
    expect(m).toEqual([2, 0, 0, 3, 0, 0])
  })

  test('from translation matrix', () => {
    const m = fromTranslation(matrix2D(), vector2(1, 2))
    expect(m).toEqual([1, 0, 0, 1, 1, 2])
  })

  test('add two matrices', () => {
    const m1 = matrix2D(1, 2, 3, 4, 5, 6)
    const m2 = matrix2D(7, 8, 9, 10, 11, 12)
    const result = add(matrix2D(), m1, m2)
    expect(result).toEqual([8, 10, 12, 14, 16, 18])
  })

  test('subtract two matrices', () => {
    const m1 = matrix2D(7, 8, 9, 10, 11, 12)
    const m2 = matrix2D(1, 2, 3, 4, 5, 6)
    const result = subtract(matrix2D(), m1, m2)
    expect(result).toEqual([6, 6, 6, 6, 6, 6])
  })

  test('multiply matrix by scalar', () => {
    const m = matrix2D(1, 2, 3, 4, 5, 6)
    const result = multiplyScalar(matrix2D(), m, 2)
    expect(result).toEqual([2, 4, 6, 8, 10, 12])
  })

  test('equality check with epsilon for matrices', () => {
    const m1 = matrix2D(1.000001, 1.000002, 1.000003, 1.000004, 1.000005, 1.000006)
    const m2 = matrix2D(1.000002, 1.00003, 1.000004, 1.000005, 1.000006, 1.000007)

    expect(equals(m1, m2)).toBe(false)

    const n1 = matrix2D(1.000001, 1.000002, 1.000003, 1.000004, 1.000005, 1.000006)
    const n2 = matrix2D(1.000002, 1.000003, 1.000004, 1.000005, 1.000006, 1.000007)

    expect(equals(n1, n2)).toBe(true)

    const m1c = matrix2D(1.000001, 1.000002, 1.000003, 1.000004, 1.000005, 1.000006)
    expect(equals(m1, m1c)).toBe(true)
  })
})
