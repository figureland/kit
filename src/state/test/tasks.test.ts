import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { tasks } from '..'
import type { Tasks } from '../tasks'
import { delay } from '../../tools/async'

describe('Task Store', () => {
  let taskStore: Tasks

  beforeEach(() => {
    taskStore = tasks()
  })

  afterEach(() => {
    taskStore.dispose()
  })

  it('should create and run a task', async () => {
    let count = 0
    const task = taskStore.add(
      'counter',
      () => {
        count++
      },
      {
        interval: 100
      }
    )

    await delay(250)
    expect(count).toBeGreaterThanOrEqual(2)
    task.dispose()
  })

  it('should respect task count limit', async () => {
    let count = 0
    const task = taskStore.add('limited', () => count++, {
      interval: 100,
      count: 2
    })

    await delay(500)
    expect(count).toBe(2)
    expect(task.active.get()).toBe(false)
  })

  it('should emit events when tasks run', async () => {
    let eventCount = 0
    taskStore.events.on('test-task', () => {
      eventCount++
    })

    taskStore.add('test-task', () => {}, {
      interval: 100,
      count: 2
    })

    await delay(250)
    expect(eventCount).toBe(2)
  })

  it('should stop task on dispose', async () => {
    let count = 0
    const task = taskStore.add('disposable', () => count++, {
      interval: 100
    })

    await delay(150)
    const initialCount = count
    task.dispose()
    await delay(150)
    expect(count).toBe(initialCount)
  })

  it('should dispose all tasks when store is disposed', async () => {
    let count1 = 0,
      count2 = 0

    taskStore.add('task1', () => count1++, { interval: 100 })
    taskStore.add('task2', () => count2++, { interval: 100 })

    await delay(150)
    const initial1 = count1
    const initial2 = count2

    taskStore.dispose()
    await delay(150)

    expect(count1).toBe(initial1)
    expect(count2).toBe(initial2)
  })

  it('should track remaining count correctly', async () => {
    const task = taskStore.add('counted', () => {}, {
      interval: 100,
      count: 3
    })

    expect(task.count.get()).toBe(3)
    await delay(150)
    expect(task.count.get()).toBe(2)
    await delay(200)
    expect(task.count.get()).toBe(0)
  })

  it('should emit dispose event when store is disposed', () => {
    let disposed = false

    taskStore.events.on('dispose', () => {
      disposed = true
    })

    taskStore.dispose()
    expect(disposed).toBe(true)
  })

  it('should handle multiple event listeners for the same task', async () => {
    let count1 = 0,
      count2 = 0

    taskStore.events.on('multi-listen', () => count1++)
    taskStore.events.on('multi-listen', () => count2++)

    taskStore.add('multi-listen', () => {}, {
      interval: 100,
      count: 1
    })

    await delay(150)
    expect(count1).toBe(1)
    expect(count2).toBe(1)
  })

  it('should retrieve task by id', () => {
    const task = taskStore.add('retrievable', () => {}, {
      interval: 100
    })

    const retrieved = taskStore.get('retrievable')
    expect(retrieved).toBe(task)
    expect(retrieved?.id).toBe('retrievable')
  })

  it('should return undefined for non-existent task id', () => {
    const retrieved = taskStore.get('non-existent')
    expect(retrieved).toBeUndefined()
  })

  it('should replace existing task with same id', async () => {
    let count1 = 0
    let count2 = 0

    // Create first task
    const task1 = taskStore.add('duplicate', () => count1++, {
      interval: 100
    })

    await delay(150)
    expect(count1).toBeGreaterThan(0)

    // Create second task with same id
    const task2 = taskStore.add('duplicate', () => count2++, {
      interval: 100
    })

    await delay(150)

    // First task should be stopped
    const initialCount1 = count1
    expect(task1.active.get()).toBe(false)

    // Second task should be running
    expect(count2).toBeGreaterThan(0)
    expect(task2.active.get()).toBe(true)

    // First task should not increment anymore
    await delay(150)
    expect(count1).toBe(initialCount1)

    // Verify get() returns the new task
    expect(taskStore.get('duplicate')).toBe(task2)
  })
})
