import { describe, it, expect } from 'bun:test'
import { events } from '..'
import { delay } from '../../tools/async'

describe('events', () => {
  type EventsMap = {
    event1: number
    event2: string
  }

  it('should subscribe to and emit a specific event', () => {
    const e = events<EventsMap>()
    let receivedValue = 0

    e.on('event1', (value) => {
      receivedValue = value
    })

    e.emit('event1', 42)
    expect(receivedValue).toBe(42)
  })

  it('should subscribe to and emit wildcard event', () => {
    const e = events<EventsMap>()
    let receivedEvent = ''
    let receivedValue: any = null
    let count = 0
    e.all(([key, value]) => {
      receivedEvent = key
      receivedValue = value
      count++
    })

    e.emit('event1', 0)
    e.emit('event2', 'hello')
    expect(receivedEvent).toBe('event2')
    expect(receivedValue).toBe('hello')
    expect(count).toBe(2)
  })

  it('should subscribe to multiple events using object', () => {
    const e = events<EventsMap>()
    let receivedValue1 = 0
    let receivedValue2 = ''

    e.on({
      event1: (value) => {
        receivedValue1 = value
      },
      event2: (value) => {
        receivedValue2 = value
      }
    })

    e.emit('event1', 42)
    e.emit('event2', 'world')

    expect(receivedValue1).toBe(42)
    expect(receivedValue2).toBe('world')
  })

  it('should remove specific event listener', () => {
    const e = events<EventsMap>()
    let receivedValue = 0

    const unsubscribe = e.on('event1', (value) => {
      receivedValue = value
    })

    unsubscribe()
    e.emit('event1', 42)

    expect(receivedValue).toBe(0)
  })

  it('should remove wildcard event listener', () => {
    const e = events<EventsMap>()
    let receivedValue: any = null

    const unsubscribe = e.all(([, value]) => {
      receivedValue = value
    })

    unsubscribe()
    e.emit('event1', 42)

    expect(receivedValue).toBe(null)
  })

  it('should remove all event listeners on dispose', () => {
    const e = events<EventsMap>()
    let receivedValue1 = 0
    let receivedValue2 = ''

    e.on('event1', (value) => {
      receivedValue1 = value
    })

    e.on('event2', (value) => {
      receivedValue2 = value
    })

    e.dispose()

    e.emit('event1', 42)
    e.emit('event2', 'world')

    expect(receivedValue1).toBe(0)
    expect(receivedValue2).toBe('')
  })

  it('should correctly report the number of listeners', () => {
    const e = events<EventsMap>()
    expect(e.size()).toBe(0)

    const unsub1 = e.on('event1', () => {})
    expect(e.size()).toBe(1)

    const unsub2 = e.on('event2', () => {})
    expect(e.size()).toBe(2)

    unsub1()
    expect(e.size()).toBe(1)

    unsub2()
    expect(e.size()).toBe(0)
  })

  it('should not affect the last update after throttle period', async () => {
    const e = events<EventsMap>()
    const throttleDuration = 100
    let latestValue = 0

    e.on('event1', (value) => {
      latestValue = value
    })

    e.emit('event1', 200)
    await delay(throttleDuration + 10)
    e.emit('event1', 300)

    expect(latestValue).toBe(300)
  })

  it('should allow number and symbol event names', () => {
    const e = events<{ [key: symbol]: number; [key: number]: string }>()
    let receivedValue: any = null
    let count = 0

    const instance = Symbol.for('instance')
    e.on(instance, (value) => {
      receivedValue = value
      count++
    })

    e.emit(instance, 10)
    expect(receivedValue).toBe(10)
    expect(count).toBe(1)

    const exampleSymbol = Symbol()
    e.on(exampleSymbol, (value) => {
      receivedValue = value
      count++
    })

    e.emit(exampleSymbol, 20)
    expect(receivedValue).toBe(20)
    expect(count).toBe(2)

    let receivedStringValue = ''

    e.on(1, (value) => {
      receivedStringValue = value
      count++
    })

    e.emit(1, 'hello')
    expect(receivedStringValue).toBe('hello')
    expect(count).toBe(3)
  })
})
