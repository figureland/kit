import { describe, it, expect } from 'bun:test'
import { map } from '../map'
import { isMap } from '../../tools/guards'

describe('map', () => {
  it('creates a reactive map with initial values', () => {
    const m = map([['a', 1], ['b', 2]])
    expect(isMap(m.get())).toBe(true)
    expect(Array.from(m.get().entries())).toEqual([['a', 1], ['b', 2]])
  })

  it('updates map values', () => {
    const m = map([['a', 1], ['b', 2]])
    m.set([['a', 3], ['c', 4]])
    expect(Array.from(m.get().entries())).toEqual([['a', 3], ['c', 4]])
  })

  it('mutates map values', () => {
    const m = map([['a', 1], ['b', 2]])
    m.mutate(map => {
      map.set('c', 3)
    })
    expect(Array.from(m.get().entries())).toEqual([['a', 1], ['b', 2], ['c', 3]])
  })

  it('notifies subscribers on update', () => {
    const m = map([['a', 1]])
    let receivedValue = new Map()
    m.on(value => {
      receivedValue = value
    })
    m.set([['b', 2]])
    expect(Array.from(receivedValue.entries())).toEqual([['b', 2]])
  })

  it('stops notifying after unsubscribe', () => {
    const m = map([['a', 1]])
    let calls = 0
    const unsubscribe = m.on(() => {
      calls++
    })
    m.set([['b', 2]])
    unsubscribe()
    m.set([['c', 3]])
    expect(calls).toBe(1)
  })

  it('creates an empty map by default', () => {
    const m = map()
    expect(isMap(m.get())).toBe(true)
    expect(m.get().size).toBe(0)
  })
}) 