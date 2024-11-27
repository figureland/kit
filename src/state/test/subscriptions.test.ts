import { describe, it, expect } from 'bun:test'
import { createSubscriptions, createTopicSubscriptions } from '../subscriptions'

describe('createSubscriptions', () => {
  it('should add and notify subscribers', () => {
    const subs = createSubscriptions()
    let receivedValue = 0

    subs.add((value) => {
      receivedValue = value
    })

    subs.each(42)
    expect(receivedValue).toBe(42)
  })

  it('should handle multiple subscribers', () => {
    const subs = createSubscriptions()
    let count = 0

    const sub1 = () => count++
    const sub2 = () => count++

    subs.add(sub1, sub2)
    subs.each()

    expect(count).toBe(2)
  })

  it('should correctly unsubscribe using returned function', () => {
    const subs = createSubscriptions()
    let count = 0

    const unsubscribe = subs.add(() => count++)
    subs.each()
    expect(count).toBe(1)

    unsubscribe()
    subs.each()
    expect(count).toBe(1)
  })

  it('should delete specific subscribers', () => {
    const subs = createSubscriptions()
    let count = 0

    const sub = () => count++
    subs.add(sub)
    subs.delete(sub)
    subs.each()

    expect(count).toBe(0)
  })

  it('should clear all subscribers on dispose', () => {
    const subs = createSubscriptions()
    let count = 0

    subs.add(() => count++)
    subs.add(() => count++)
    subs.dispose()
    subs.each()

    expect(count).toBe(0)
  })

  it('should correctly report size', () => {
    const subs = createSubscriptions()
    expect(subs.size()).toBe(0)

    const unsub = subs.add(() => {})
    expect(subs.size()).toBe(1)

    unsub()
    expect(subs.size()).toBe(0)
  })
})

describe('createTopicSubscriptions', () => {
  it('should add and notify topic-specific subscribers', () => {
    const subs = createTopicSubscriptions<string>()
    let receivedValue = 0

    subs.add('topic1', (value) => {
      receivedValue = value
    })

    subs.each('topic1', 42)
    expect(receivedValue).toBe(42)
  })

  it('should handle multiple topics independently', () => {
    const subs = createTopicSubscriptions<string>()
    const values: Record<string, number> = {}

    subs.add('topic1', (value) => (values.topic1 = value))
    subs.add('topic2', (value) => (values.topic2 = value))

    subs.each('topic1', 1)
    subs.each('topic2', 2)

    expect(values.topic1).toBe(1)
    expect(values.topic2).toBe(2)
  })

  it('should correctly unsubscribe from topics', () => {
    const subs = createTopicSubscriptions<string>()
    let count = 0

    const unsubscribe = subs.add('topic1', () => count++)
    subs.each('topic1', null)
    expect(count).toBe(1)

    unsubscribe()
    subs.each('topic1', null)
    expect(count).toBe(1)
  })

  it('should clear all topic subscribers on dispose', () => {
    const subs = createTopicSubscriptions<string>()
    let count = 0

    subs.add('topic1', () => count++)
    subs.add('topic2', () => count++)
    subs.dispose()

    subs.each('topic1', null)
    subs.each('topic2', null)

    expect(count).toBe(0)
  })

  it('should correctly report total size across topics', () => {
    const subs = createTopicSubscriptions<string>()
    expect(subs.size()).toBe(0)

    const unsub1 = subs.add('topic1', () => {})
    const unsub2 = subs.add('topic2', () => {})
    expect(subs.size()).toBe(2)

    unsub1()
    expect(subs.size()).toBe(1)

    unsub2()
    expect(subs.size()).toBe(0)
  })

  it('should work with number topics', () => {
    const subs = createTopicSubscriptions<number>()
    let receivedValue = 0

    subs.add(1, (value) => {
      receivedValue = value
    })

    subs.each(1, 42)
    expect(receivedValue).toBe(42)
  })

  it('should work with symbol topics', () => {
    const subs = createTopicSubscriptions<symbol>()
    let receivedValue = 0
    const topic = Symbol('test')

    subs.add(topic, (value) => {
      receivedValue = value
    })

    subs.each(topic, 42)
    expect(receivedValue).toBe(42)
  })
})
