import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { tasks } from '..'
import type { Tasks } from '../tasks'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Task Manager', () => {
  let taskManager: Tasks

  beforeEach(() => {
    taskManager = tasks()
  })

  afterEach(() => {
    taskManager.dispose()
  })

  it('should create and run a task', async () => {
    let count = 0
    const task = taskManager.add(
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
    const task = taskManager.add(
      'limited',
      () => {
        count++
      },
      {
        interval: 100,
        count: 2
      }
    )

    await delay(500)
    expect(count).toBe(2)
    expect(task.active.get()).toBe(false)
  })

  it('should emit events when tasks run', async () => {
    let eventCount = 0
    taskManager.events.on('test-task', () => {
      eventCount++
    })

    taskManager.add('test-task', () => {}, {
      interval: 100,
      count: 2
    })

    await delay(250)
    expect(eventCount).toBe(2)
  })

  it('should stop task on dispose', async () => {
    let count = 0
    const task = taskManager.add(
      'disposable',
      () => {
        count++
      },
      {
        interval: 100
      }
    )

    await delay(150)
    const initialCount = count
    task.dispose()
    await delay(150)
    expect(count).toBe(initialCount)
  })

  it('should dispose all tasks when manager is disposed', async () => {
    let count1 = 0,
      count2 = 0

    taskManager.add('task1', () => count1++, { interval: 100 })
    taskManager.add('task2', () => count2++, { interval: 100 })

    await delay(150)
    const initial1 = count1
    const initial2 = count2

    taskManager.dispose()
    await delay(150)

    expect(count1).toBe(initial1)
    expect(count2).toBe(initial2)
  })

  it('should track remaining count correctly', async () => {
    const task = taskManager.add('counted', () => {}, {
      interval: 100,
      count: 3
    })

    expect(task.count.get()).toBe(3)
    await delay(150)
    expect(task.count.get()).toBe(2)
    await delay(200)
    expect(task.count.get()).toBe(0)
  })

  it('should emit dispose event when manager is disposed', () => {
    let disposed = false

    taskManager.events.on('dispose', () => {
      disposed = true
    })

    taskManager.dispose()
    expect(disposed).toBe(true)
  })

  it('should handle multiple event listeners for the same task', async () => {
    let count1 = 0,
      count2 = 0

    taskManager.events.on('multi-listen', () => count1++)
    taskManager.events.on('multi-listen', () => count2++)

    taskManager.add('multi-listen', () => {}, {
      interval: 100,
      count: 1
    })

    await delay(150)
    expect(count1).toBe(1)
    expect(count2).toBe(1)
  })

  it('should retrieve task by id', () => {
    const task = taskManager.add('retrievable', () => {}, {
      interval: 100
    })

    const retrieved = taskManager.get('retrievable')
    expect(retrieved).toBe(task)
    expect(retrieved?.id).toBe('retrievable')
  })

  it('should return undefined for non-existent task id', () => {
    const retrieved = taskManager.get('non-existent')
    expect(retrieved).toBeUndefined()
  })

  it('should replace existing task with same id', async () => {
    let count1 = 0
    let count2 = 0

    // Create first task
    const task1 = taskManager.add(
      'duplicate',
      () => {
        count1++
      },
      {
        interval: 100
      }
    )

    await delay(150)
    expect(count1).toBeGreaterThan(0)

    // Create second task with same id
    const task2 = taskManager.add(
      'duplicate',
      () => {
        count2++
      },
      {
        interval: 100
      }
    )

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
    expect(taskManager.get('duplicate')).toBe(task2)
  })
})
