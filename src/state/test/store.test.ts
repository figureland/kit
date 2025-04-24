import { describe, it, expect, mock } from 'bun:test'
import { store, disposable, state } from '..'

describe('store', () => {
  it('uses a disposable object', () => {
    const st = store()
    let disposed = false

    st.use(
      disposable(() => {
        disposed = true
      })
    )

    st.dispose()
    expect(disposed).toBe(true)
  })

  it('uses a cleanup function directly', () => {
    const st = store()
    let cleaned = false

    st.use(() => {
      cleaned = true
    })

    st.dispose()
    expect(cleaned).toBe(true)
  })

  it('manages unique disposables with keys', () => {
    const st = store()
    let disposeCount = 0

    const createDisposable = () =>
      disposable(() => {
        disposeCount++
      })

    // Same key should reuse the disposable
    const first = st.unique('test', createDisposable)
    const second = st.unique('test', createDisposable)

    expect(first).toBe(second)
    st.dispose()
    expect(disposeCount).toBe(1)
  })

  it('handles multiple disposables', () => {
    const st = store()
    const disposed: string[] = []

    st.use(disposable(() => disposed.push('first')))
    st.use(disposable(() => disposed.push('second')))
    st.use(() => disposed.push('third'))

    st.dispose()
    expect(disposed).toEqual(['first', 'second', 'third'])
  })

  it('clears unique disposables on dispose', () => {
    const st = store()
    let disposed = false

    st.unique('key', () =>
      disposable(() => {
        disposed = true
      })
    )

    st.dispose()
    expect(disposed).toBe(true)

    // After dispose, creating a new unique disposable should work
    disposed = false
    st.unique('key', () =>
      disposable(() => {
        disposed = true
      })
    )
    expect(disposed).toBe(false)
  })

  it('should clear all subscriptions on dispose', () => {
    const testStore = store()
    const mockDispose1 = mock(() => ({}))
    const mockDispose2 = mock(() => ({}))
    testStore.use(disposable(mockDispose1))
    testStore.use(disposable(mockDispose2))
    testStore.dispose()
    expect(mockDispose1).toHaveBeenCalled()
    expect(mockDispose2).toHaveBeenCalled()
  })

  it('should clear all keyed subscriptions on dispose', () => {
    const testStore = store()
    const mockDispose = mock(() => ({}))
    const mockSubscribable = () => disposable(mockDispose)
    testStore.unique('key1', mockSubscribable)
    testStore.dispose()
    const newInstance = testStore.unique('key1', mockSubscribable)
    expect(newInstance).not.toBe(mockDispose.mock.results[0].value)
  })
})

describe('disposable', () => {
  it('creates a disposable object', () => {
    let disposed = false
    const obj = disposable(() => {
      disposed = true
    })

    expect(typeof obj.dispose).toBe('function')
    obj.dispose()
    expect(disposed).toBe(true)
  })
})

describe('store children', () => {
  it('uses a state', () => {
    const st = store()
    const s = st.use(state(0))
    expect(s.get()).toBe(0)
  })
  it('disposes child states when store is disposed', () => {
    const st = store()
    const s = st.use(state(0))
    let disposed = false
    let notified = false

    s.events.on('dispose', () => {
      disposed = true
    })

    s.on(() => {
      notified = true
    })

    st.dispose()
    expect(disposed).toBe(true)
    s.set(1)
    expect(s.get()).toBe(1)
    expect(notified).toBe(false)
  })
})
