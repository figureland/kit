import { describe, it, expect } from 'bun:test'
import { wrap } from '../wrap'
import Big, { type BigSource } from 'big.js'
import { isMap } from '../../tools'

describe('wrap', () => {
  const decimal = wrap((v: BigSource) => new Big(v), {
    get: (instance) => instance.value.toString(),
    set: (instance, newValue) => {
      instance.value = new Big(newValue)
    }
  })

  it('creates a big state with correct initial value', () => {
    const b = decimal(10)
    expect(b.get()).toBe('10')
  })

  it('updates the big state value', () => {
    const b = decimal(10)
    b.set(20)
    expect(b.get()).toBe('20')
  })

  it('creates a derived state', () => {
    const b = decimal(10)
    const derived = b.derived((v) => v.times(2).toString())
    expect(derived.get()).toBe('20')
  })

  it('updates derived state when original state changes', () => {
    const b = decimal(10)
    const derived = b.derived((v) => v.times(2).toString())
    expect(derived.get()).toBe('20')
    b.set(15)
    expect(derived.get()).toBe('30')
    b.set(0)
    expect(derived.get()).toBe('0')
  })

  it('returns the correct instance', () => {
    const b = decimal(10)
    const instance = b.instance()
    expect(instance).toBeInstanceOf(Big)
    expect(instance.toString()).toBe('10')
  })

  it('notifies subscribers on update', () => {
    const b = decimal(10)
    let receivedValue = ''
    b.on((value) => {
      receivedValue = value
    })
    b.set(20)
    expect(receivedValue).toBe('20')
  })

  it('stops notifying after unsubscribe', () => {
    const b = decimal(10)
    let calls = 0
    const unsubscribe = b.on(() => {
      calls += 1
    })
    b.set(20)
    unsubscribe()
    b.set(30)
    expect(calls).toBe(1)
  })

  it('supports chained derived states', () => {
    const b = decimal(10)
    const d = b.derived((v) => v.times(2).plus(1).toString())

    expect(d.get()).toBe('21')

    b.set(20)
    expect(d.get()).toBe('41')
  })

  it('calls onCreate', () => {
    let calls = 0
    const decimal2 = wrap((v: BigSource) => new Big(v), {
      get: (instance) => instance.value.toString(),
      set: (instance, newValue) => {
        instance.value = new Big(newValue)
      },
      onCreate: () => {
        calls += 1
      }
    })
    expect(calls).toBe(0)

    const example = decimal2(10)
    expect(example.get()).toBe('10')

    expect(calls).toBe(1)

    const example2 = decimal2(20)
    expect(example2.get()).toBe('20')

    expect(calls).toBe(2)
  })

  it('wraps JavaScript Map', () => {
    const reactiveMap = wrap((initial: [string, number][]) => new Map(initial), {
      set: (instance, entries) => {
        instance.value = new Map(entries)
      }
    })

    const m = reactiveMap([
      ['a', 1],
      ['b', 2]
    ])

    expect(isMap(m.get())).toBe(true)

    let m1 = Array.from(m.get().entries())

    m.mutate((m) => {
      m.set('c', 3)
    })

    expect(m1).toEqual([
      ['a', 1],
      ['b', 2]
    ])

    m.set([
      ['a', 10],
      ['c', 3]
    ])

    let m2 = Array.from(m.get().entries())

    expect(m2).toEqual([
      ['a', 10],
      ['c', 3]
    ])

    const keysOnly = m.derived((entries) => Array.from(entries.keys()).map(([k]) => k))

    expect(keysOnly.get()).toEqual(['a', 'c'])

    m.mutate((m) => {
      m.set('d', 4)
    })

    expect(keysOnly.get()).toEqual(['a', 'c', 'd'])

    m.set([
      ['a', 10],
      ['c', 3]
    ])

    expect(keysOnly.get()).toEqual(['a', 'c'])
  })
})
