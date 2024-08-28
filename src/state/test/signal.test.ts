import { describe, it, expect } from 'bun:test'
import { state } from '..'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('state', () => {
  it('creates a state and retrieves its value', () => {
    const initialValue = 10
    const numState = state(() => initialValue)
    expect(numState.get()).toBe(initialValue)
  })
  it('creates a single with a primitive value', () => {
    const numState = state(20)
    expect(numState.get()).toBe(20)
    numState.set(30)
    expect(numState.get()).toBe(30)
  })
  it('creates a state and retrieves its value', () => {
    const initialValue = 10
    const numState = state(() => initialValue)
    expect(numState.get()).toBe(initialValue)
  })
  it('updates the state value', () => {
    const numState = state(() => 10)
    numState.set(20)
    expect(numState.get()).toBe(20)
  })
  it('notifies subscribers on update', () => {
    const numState = state(() => 10)
    let receivedValue = 0
    numState.on((value) => {
      receivedValue = value
    })
    numState.set(20)
    expect(receivedValue).toBe(20)
  })
  it('adds and removes subscriptions, and size() works correctly', () => {
    const numState = state(() => 10)
    const unsub0 = numState.on(() => {})
    expect(numState.events.size()).toBe(1)
    const unsub1 = numState.on(() => {})
    expect(numState.events.size()).toBe(2)
    const unsub3 = numState.on(() => {})
    expect(numState.events.size()).toBe(3)
    unsub3()
    expect(numState.events.size()).toBe(2)
    unsub0()
    unsub1()
    expect(numState.events.size()).toBe(0)
  })

  it('stops notifying after unsubscribe', () => {
    const numState = state(() => 10)
    let calls = 0
    const unsubscribe = numState.on(() => {
      calls += 1
    })
    numState.set(20)
    unsubscribe()
    numState.set(30)
    expect(calls).toBe(1)
  })

  it('disposes of all subscriptions', () => {
    const numState = state(() => 10)
    let calls = 0
    numState.on(() => {
      calls += 1
    })
    numState.dispose()
    numState.set(20)
    expect(calls).toBe(0)
  })
})

describe('state with options', () => {
  it('uses custom equality function', () => {
    const customEquality = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)
    const stateWithOptions = state(() => ({ a: 1 }), { equality: customEquality })
  })
  it('uses typed custom equality function', () => {
    const customEquality = (a: { v: number }, b: { v: number }) => a.v === b.v
    const stateWithOptions = state(() => ({ v: 1 }), { equality: customEquality })
  })
})

describe('state with throttle', () => {
  it('does not emit updates more frequently than throttle limit', async () => {
    const startValue = 10
    const throttleDuration = 200
    const testState = state(() => startValue, { throttle: throttleDuration })
    await delay(throttleDuration)

    let emitCount = 0
    testState.on(() => {
      emitCount++
    })

    testState.set(20)
    testState.set(30)
    await delay(throttleDuration)
    testState.set(40)
    testState.set(10)

    expect(emitCount).toBe(2)
  })

  it('emits immediately for the first update', () => {
    const initialValue = 5
    const testState = state(() => initialValue, { throttle: 100 })
    let receivedValue = 0
    testState.on((value) => {
      receivedValue = value
    })

    testState.set(15)
    expect(receivedValue).toBe(15)
  })

  it('throttle does not affect the last update after throttle period', async () => {
    const initialValue = 100
    const throttleDuration = 100
    const testState = state(() => initialValue, { throttle: throttleDuration })
    let latestValue = 0

    testState.on((value) => {
      latestValue = value
    })

    testState.set(200)
    await delay(throttleDuration + 10)
    testState.set(300)

    expect(latestValue).toBe(300)
  })
})