import { test, describe, beforeEach, afterEach, expect } from 'bun:test'
import { vector2, lerp as lerpVec2 } from '../../math/vector2'
import { lerp } from '../../math/number'
import { type Animated, animation } from '../animated'
import { state } from '../state'

let lastTime = 0

describe('Animation System', () => {
  let engine: Animated

  beforeEach(() => {
    lastTime = 0
    engine = animation({ fps: 30 })
  })

  afterEach(() => {
    engine.dispose()
  })

  test('Engine should start and emit start event', () => {
    let started = false
    engine.events.on('start', () => {
      started = true
    })
    engine.start()
    expect(started).toBe(true)
  })

  test('Engine should stop and emit stop event', () => {
    let stopped = false
    engine.events.on('stop', () => {
      stopped = true
    })
    engine.start()
    engine.stop()
    expect(stopped).toBe(true)
  })

  test('Engine should manage animated states correctly', () => {
    const rawState = state(() => 0)

    const animatedSig = engine.animated(rawState, {
      interpolate: lerp,
      duration: 500
    })

    expect(animatedSig.get()).toBeCloseTo(0)

    rawState.set(100)
    engine.tick(250)

    expect(animatedSig.get()).toBeCloseTo(50)
    engine.tick(500)
    expect(animatedSig.get()).toBeCloseTo(100)
  })

  test('Vector2 animation should interpolate correctly', () => {
    const v = state(() => vector2(0, 0))

    const animatedVector = engine.animated(v, {
      interpolate: (from, to, amount) => lerpVec2(from, from, to, amount),
      duration: 500
    })

    v.set(vector2(10, 10))
    engine.tick(250)
    expect(animatedVector.get().x).toBeCloseTo(5)
    expect(animatedVector.get().y).toBeCloseTo(5)

    engine.tick(375)
    expect(animatedVector.get().x).toBeCloseTo(8.75)
    expect(animatedVector.get().y).toBeCloseTo(8.75)

    engine.tick(500)
    expect(animatedVector.get().x).toBeCloseTo(10)
    expect(animatedVector.get().y).toBeCloseTo(10)

    v.set(vector2(-20, 0))
    engine.tick(750)

    expect(animatedVector.get().x).toBeCloseTo(-5)
    expect(animatedVector.get().y).toBeCloseTo(5)

    engine.tick(1000)

    expect(animatedVector.get().x).toBeCloseTo(-20)
    expect(animatedVector.get().y).toBeCloseTo(0)

    engine.tick(1250)

    expect(animatedVector.get().x).toBeCloseTo(-20)
    expect(animatedVector.get().y).toBeCloseTo(0)
  })

  test('Vector2 animation should emit events', () => {
    const v = state(() => vector2())

    let count = 0

    const animatedVector = engine.animated(v, {
      interpolate: (from, to, amount) => lerpVec2(vector2(), from, to, amount),
      duration: 500
    })

    animatedVector.on((vx) => {
      count++
    })

    v.set(vector2(10, 10))
    engine.tick(250)

    expect(count).toBe(2)

    engine.tick(500)
    expect(count).toBe(3)
  })
  test('Number animation should emit events', () => {
    const v = state(() => 0)

    let count = 0

    const animatedNumber = engine.animated(v, {
      interpolate: lerp,
      duration: 500
    })

    animatedNumber.on(() => {
      count++
    })

    v.set(10)
    engine.tick(250)

    expect(count).toBe(2)
    expect(animatedNumber.get()).toBe(5)

    engine.tick(500)
    expect(count).toBe(3)
    expect(v.get()).toBe(10)
  })
})
