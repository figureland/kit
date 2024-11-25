import { describe, it, expect, mock } from 'bun:test'
import { lifecycle, disposable } from '../lifecycle'
import type { Subscribable } from '../api'

describe('lifecycle', () => {
  it('should create a lifecycle with use, unique, and dispose methods', () => {
    const testLifecycle = lifecycle()
    expect(testLifecycle).toHaveProperty('use')
    expect(testLifecycle).toHaveProperty('unique')
    expect(testLifecycle).toHaveProperty('dispose')
  })

  it('should use and dispose a disposable', () => {
    const testLifecycle = lifecycle()
    const mockDispose = mock(() => ({}))
    const disp = disposable(mockDispose)
    testLifecycle.use(disp)
    testLifecycle.dispose()
    expect(mockDispose).toHaveBeenCalled()
  })

  it('should use and dispose a function', () => {
    const testLifecycle = lifecycle()
    const mockDispose = mock(() => ({}))
    testLifecycle.use(mockDispose)
    testLifecycle.dispose()
    expect(mockDispose).toHaveBeenCalled()
  })

  it('should create unique instances based on keys', () => {
    const testLifecycle = lifecycle()
    const st = {}
    const mockSubscribable = mock(() => st as Subscribable)
    const instance1 = testLifecycle.unique('key1', mockSubscribable)
    const instance2 = testLifecycle.unique('key1', mockSubscribable)
    expect(instance1).toBe(instance2)
    expect(mockSubscribable).toHaveBeenCalledTimes(1)
  })

  it('should clear all keyed subscriptions on dispose', () => {
    const testLifecycle = lifecycle()
    const mockDispose = mock(() => ({}))
    const mockSubscribable = () => disposable(mockDispose) as Subscribable
    testLifecycle.unique('key1', mockSubscribable)
    testLifecycle.dispose()
    const newInstance = testLifecycle.unique('key1', mockSubscribable)
    expect(newInstance).not.toBe(mockDispose.mock.results[0].value)
  })

  it('should clear all subscriptions on dispose', () => {
    const testLifecycle = lifecycle()
    const mockDispose1 = mock(() => ({}))
    const mockDispose2 = mock(() => ({}))
    testLifecycle.use(disposable(mockDispose1))
    testLifecycle.use(disposable(mockDispose2))
    testLifecycle.dispose()
    expect(mockDispose1).toHaveBeenCalled()
    expect(mockDispose2).toHaveBeenCalled()
  })
})
