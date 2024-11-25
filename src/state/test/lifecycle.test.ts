import { describe, it, expect } from 'bun:test'
import { lifecycle, disposable, state } from '..'

describe('lifecycle', () => {
  it('uses a disposable object', () => {
    const life = lifecycle()
    let disposed = false

    life.use(
      disposable(() => {
        disposed = true
      })
    )

    life.dispose()
    expect(disposed).toBe(true)
  })

  it('uses a cleanup function directly', () => {
    const life = lifecycle()
    let cleaned = false

    life.use(() => {
      cleaned = true
    })

    life.dispose()
    expect(cleaned).toBe(true)
  })

  it('manages unique disposables with keys', () => {
    const life = lifecycle()
    let disposeCount = 0

    const createDisposable = () =>
      disposable(() => {
        disposeCount++
      })

    // Same key should reuse the disposable
    const first = life.unique('test', createDisposable)
    const second = life.unique('test', createDisposable)

    expect(first).toBe(second)
    life.dispose()
    expect(disposeCount).toBe(1)
  })

  it('handles multiple disposables', () => {
    const life = lifecycle()
    const disposed: string[] = []

    life.use(disposable(() => disposed.push('first')))
    life.use(disposable(() => disposed.push('second')))
    life.use(() => disposed.push('third'))

    life.dispose()
    expect(disposed).toEqual(['first', 'second', 'third'])
  })

  it('clears unique disposables on dispose', () => {
    const life = lifecycle()
    let disposed = false

    life.unique('key', () =>
      disposable(() => {
        disposed = true
      })
    )

    life.dispose()
    expect(disposed).toBe(true)

    // After dispose, creating a new unique disposable should work
    disposed = false
    life.unique('key', () =>
      disposable(() => {
        disposed = true
      })
    )
    expect(disposed).toBe(false)
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

describe('lifecycle children', () => {
  it('uses a state', () => {
    const life = lifecycle()
    const s = life.use(state(0))
    expect(s.get()).toBe(0)
  })
  it('disposes child states when lifecycle is disposed', () => {
    const life = lifecycle()
    const s = life.use(state(0))
    let disposed = false
    let notified = false

    s.events.on('dispose', () => {
      disposed = true
    })

    s.on(() => {
      notified = true
    })

    life.dispose()
    expect(disposed).toBe(true)
    s.set(1)
    expect(s.get()).toBe(1)
    expect(notified).toBe(false)
  })
})
