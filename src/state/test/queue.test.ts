import { describe, it, expect } from 'bun:test'
import { queue } from '..'
import { delay } from '../../tools/async'

describe('queue', () => {
  it('creates a queue and manages items correctly', () => {
    const q = queue<number>()
    q.enqueue(1)
    q.enqueue(2)
    expect(q.get()).toEqual([1, 2])
  })

  it('dequeues items in FIFO order', () => {
    const q = queue<string>()
    q.enqueue('first')
    q.enqueue('second')

    expect(q.dequeue()).toBe('first')
    expect(q.dequeue()).toBe('second')
    expect(q.get()).toEqual([])
  })

  it('respects maxSize option', () => {
    const q = queue<number>({ maxSize: 2 })
    q.enqueue(1)
    q.enqueue(2)
    q.enqueue(3)
    expect(q.get()).toEqual([2, 3])
  })

  it('notifies subscribers on updates', () => {
    const q = queue<string>()
    let lastValue: string[] = []

    q.on((value) => {
      lastValue = value
    })

    q.enqueue('test')
    expect(lastValue).toEqual(['test'])
  })

  it('emits events for queue operations', () => {
    const q = queue<number>()
    const events: { type: string; value?: number }[] = []

    q.events.on('enqueue', (value) => {
      events.push({ type: 'enqueue', value })
    })
    q.events.on('dequeue', (value) => {
      events.push({ type: 'dequeue', value })
    })

    q.enqueue(1)
    q.enqueue(2)
    q.dequeue()

    expect(events).toEqual([
      { type: 'enqueue', value: 1 },
      { type: 'enqueue', value: 2 },
      { type: 'dequeue', value: 1 }
    ])
  })

  it('clears the queue', () => {
    const q = queue<number>()
    q.enqueue(1)
    q.enqueue(2)

    q.clear()
    expect(q.get()).toEqual([])
  })

  it('peeks at the next item without removing it', () => {
    const q = queue<string>()
    q.enqueue('first')
    q.enqueue('second')

    expect(q.peek()).toBe('first')
    expect(q.get()).toEqual(['first', 'second'])
  })

  it('handles throttling correctly', async () => {
    const q = queue<number>({ throttle: 100 })
    let updateCount = 0

    q.on(() => updateCount++)

    q.enqueue(1)
    q.enqueue(2)
    q.enqueue(3)

    await delay(150)
    expect(updateCount).toBe(1)

    q.enqueue(4)
    await delay(150)
    expect(updateCount).toBe(2)

    q.enqueue(5)
    expect(updateCount).toBe(3)
  })

  it('disposes properly and stops notifications', () => {
    const q = queue<number>()
    let updateCount = 0

    q.on(() => {
      updateCount++
    })

    q.enqueue(1)
    expect(updateCount).toBe(1)

    q.dispose()
    q.enqueue(2)
    expect(updateCount).toBe(1)
  })
})
