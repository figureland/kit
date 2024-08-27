import { describe, test, expect } from 'bun:test'
import { PI, TAU } from '../../math/constants'
import { cos, sin } from '../../math'
import {
  randomInt,
  randomFloat,
  randomBool,
  randomSign,
  randomElement,
  randomize,
  randomVector2,
  randomVector2InBox,
  randomVector2InCircle,
  randomVector2InEllipse,
  randomVector2InRing,
  randomVector2InSector
} from '../random'

const mockRandom = () => 0.5

describe('Random number generation', () => {
  test('randomInt generates an integer within a range', () => {
    expect(randomInt(1, 100, mockRandom)).toBe(51)
    expect(randomInt(-100, 100)).toBeGreaterThanOrEqual(-100)
    expect(randomInt(-100, 100)).toBeLessThanOrEqual(100)

    expect(randomInt(300, 500)).toBeGreaterThanOrEqual(300)
    expect(randomInt(300, 500)).toBeLessThanOrEqual(500)
  })

  test('randomFloat generates a float within a range', () => {
    expect(randomFloat(0.0, 1.0, mockRandom)).toBeCloseTo(0.5)
    expect(randomFloat(0.0, 1.0)).toBeLessThanOrEqual(1.0)
    expect(randomFloat(0.0, 1.0)).toBeGreaterThanOrEqual(0.0)
  })

  test('randomBool generates a boolean', () => {
    expect(randomBool(mockRandom)).toBe(true)
  })

  test('randomSign generates either 1 or -1', () => {
    expect(randomSign(mockRandom)).toBe(1)
  })

  test('randomElement selects an element from an array', () => {
    const arr = [10, 20, 30, 40, 50]
    expect(randomElement(arr)).toBeOneOf(arr)
  })

  test('randomize shuffles an array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    expect(randomize(arr)).not.toEqual(arr)
  })

  test('randomVector2 generates a vector within a range', () => {
    const vec = randomVector2(0, 10, mockRandom)
    expect(vec.x).toBeCloseTo(5)
    expect(vec.y).toBeCloseTo(5)
  })

  test('randomVector2InBox generates a vector within a box', () => {
    const box = { x: 0, y: 0, width: 10, height: 20 }
    const vec = randomVector2InBox(box, mockRandom)
    expect(vec.x).toBeCloseTo(5)
    expect(vec.y).toBeCloseTo(10)
  })

  test('randomVector2InCircle generates a vector within a circle', () => {
    const radius = 10
    const vec = randomVector2InCircle(radius, mockRandom)
    expect(vec.x).toBeCloseTo(radius * cos(TAU * 0.5))
    expect(vec.y).toBeCloseTo(radius * sin(TAU * 0.5))
  })

  test('randomVector2InEllipse generates a vector within an ellipse', () => {
    const vec = randomVector2InEllipse(10, 20, mockRandom)
    expect(vec.x).toBeCloseTo(10 * cos(TAU * 0.5))
    expect(vec.y).toBeCloseTo(20 * sin(TAU * 0.5))
  })

  test('randomVector2InRing generates a vector within a ring', () => {
    const vec = randomVector2InRing(5, 10, mockRandom)
    expect(vec.x).toBeCloseTo(7.5 * cos(TAU * 0.5))
    expect(vec.y).toBeCloseTo(7.5 * sin(TAU * 0.5))
  })

  test('randomVector2InSector generates a vector within a sector', () => {
    const vec = randomVector2InSector(10, PI, 1.5 * PI, mockRandom)
    expect(vec.x).toBeCloseTo(10 * cos(1.25 * PI))
    expect(vec.y).toBeCloseTo(10 * sin(1.25 * PI))
  })
})
