import { describe, it, expect } from 'bun:test'
import { signal } from '..'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('signal', () => {
  it('creates a signal and retrieves its value', () => {
    const initialValue = 10
    const numSignal = signal(() => initialValue)
    expect(numSignal.get()).toBe(initialValue)
  })
  it('creates a single with a primitive value', () => {
    const numSignal = signal(20)
    expect(numSignal.get()).toBe(20)
    numSignal.set(30)
    expect(numSignal.get()).toBe(30)
  })
  it('creates a signal and retrieves its value', () => {
    const initialValue = 10
    const numSignal = signal(() => initialValue)
    expect(numSignal.get()).toBe(initialValue)
  })
  it('updates the signal value', () => {
    const numSignal = signal(() => 10)
    numSignal.set(20)
    expect(numSignal.get()).toBe(20)
  })
  it('notifies subscribers on update', () => {
    const numSignal = signal(() => 10)
    let receivedValue = 0
    numSignal.on((value) => {
      receivedValue = value
    })
    numSignal.set(20)
    expect(receivedValue).toBe(20)
  })
  it('adds and removes subscriptions, and size() works correctly', () => {
    const numSignal = signal(() => 10)
    const unsub0 = numSignal.on(() => {})
    expect(numSignal.events.size()).toBe(1)
    const unsub1 = numSignal.on(() => {})
    expect(numSignal.events.size()).toBe(2)
    const unsub3 = numSignal.on(() => {})
    expect(numSignal.events.size()).toBe(3)
    unsub3()
    expect(numSignal.events.size()).toBe(2)
    unsub0()
    unsub1()
    expect(numSignal.events.size()).toBe(0)
  })

  it('stops notifying after unsubscribe', () => {
    const numSignal = signal(() => 10)
    let calls = 0
    const unsubscribe = numSignal.on(() => {
      calls += 1
    })
    numSignal.set(20)
    unsubscribe()
    numSignal.set(30)
    expect(calls).toBe(1)
  })

  it('disposes of all subscriptions', () => {
    const numSignal = signal(() => 10)
    let calls = 0
    numSignal.on(() => {
      calls += 1
    })
    numSignal.dispose()
    numSignal.set(20)
    expect(calls).toBe(0)
  })
})

describe('signal with options', () => {
  it('uses custom equality function', () => {
    const customEquality = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)
    const signalWithOptions = signal(() => ({ a: 1 }), { equality: customEquality })
  })
  it('uses typed custom equality function', () => {
    const customEquality = (a: { v: number }, b: { v: number }) => a.v === b.v
    const signalWithOptions = signal(() => ({ v: 1 }), { equality: customEquality })
  })
})

describe('signal with throttle', () => {
  it('does not emit updates more frequently than throttle limit', async () => {
    const startValue = 10
    const throttleDuration = 200
    const testSignal = signal(() => startValue, { throttle: throttleDuration })
    await delay(throttleDuration)

    let emitCount = 0
    testSignal.on(() => {
      emitCount++
    })

    testSignal.set(20)
    testSignal.set(30)
    await delay(throttleDuration)
    testSignal.set(40)
    testSignal.set(10)

    expect(emitCount).toBe(2)
  })

  it('emits immediately for the first update', () => {
    const initialValue = 5
    const testSignal = signal(() => initialValue, { throttle: 100 })
    let receivedValue = 0
    testSignal.on((value) => {
      receivedValue = value
    })

    testSignal.set(15)
    expect(receivedValue).toBe(15)
  })

  it('throttle does not affect the last update after throttle period', async () => {
    const initialValue = 100
    const throttleDuration = 100
    const testSignal = signal(() => initialValue, { throttle: throttleDuration })
    let latestValue = 0

    testSignal.on((value) => {
      latestValue = value
    })

    testSignal.set(200)
    await delay(throttleDuration + 10)
    testSignal.set(300)

    expect(latestValue).toBe(300)
  })
})
