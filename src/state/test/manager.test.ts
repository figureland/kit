import { describe, it, expect, mock } from 'bun:test'
import { disposable, Manager, type Subscribable } from '..'

describe('Manager', () => {
  it('should have use, unique, and dispose methods', () => {
    const manager = new Manager()
    expect(manager).toHaveProperty('use')
    expect(manager).toHaveProperty('unique')
    expect(manager).toHaveProperty('dispose')
  })

  it('should use and dispose a disposable', () => {
    const manager = new Manager()
    const mockDispose = mock(() => ({}))
    const disp = disposable(mockDispose)
    manager.use(disp)
    manager.dispose()
    expect(mockDispose).toHaveBeenCalled()
  })

  it('should use and dispose a function', () => {
    const manager = new Manager()
    const mockDispose = mock(() => ({}))
    manager.use(mockDispose)
    manager.dispose()
    expect(mockDispose).toHaveBeenCalled()
  })

  it('should create unique instances based on keys', () => {
    const manager = new Manager()
    const mockSubscribable = mock(() => ({}) as Subscribable)
    const instance1 = manager.unique('key1', mockSubscribable)
    const instance2 = manager.unique('key1', mockSubscribable)
    expect(instance1).toBe(instance2)
    expect(mockSubscribable).toHaveBeenCalledTimes(1)
  })

  it('should clear all keyed subscriptions on dispose', () => {
    const manager = new Manager()
    const mockSubscribable = mock(() => ({}))
    manager.unique('key1', () => disposable(mockSubscribable) as Subscribable)
    manager.dispose()
    const newInstance = manager.unique('key1', () => disposable(mockSubscribable) as Subscribable)
    expect(newInstance).not.toBe(mockSubscribable.mock.results[0].value)
  })

  it('should clear all subscriptions on dispose', () => {
    const manager = new Manager()

    const mockDispose1 = mock(() => ({}))
    const mockDispose2 = mock(() => ({}))
    manager.use(disposable(mockDispose1))
    manager.use(disposable(mockDispose2))
    manager.dispose()
    expect(mockDispose1).toHaveBeenCalled()
    expect(mockDispose2).toHaveBeenCalled()
  })

  it('should extend the Manager class and behave as expected', () => {
    class ExtendedManager extends Manager {
      public readonly test = 'test'
    }

    const manager = new ExtendedManager()
    expect(manager).toHaveProperty('use')
    expect(manager).toHaveProperty('unique')
    expect(manager).toHaveProperty('dispose')
    expect(manager).toHaveProperty('test')
    expect(manager.test).toBe('test')

    const mockDispose1 = mock(() => ({}))
    const mockDispose2 = mock(() => ({}))
    manager.use(disposable(mockDispose1))
    manager.use(disposable(mockDispose2))
    manager.dispose()
    expect(mockDispose1).toHaveBeenCalled()
    expect(mockDispose2).toHaveBeenCalled()
  })
})
