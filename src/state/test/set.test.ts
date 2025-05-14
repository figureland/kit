import { describe, it, expect } from 'bun:test'
import { set } from '../set'
import { isSet } from '../../tools/guards'

describe('set', () => {
  it('creates a reactive set with initial values', () => {
    const s = set([1, 2, 3])
    expect(isSet(s.get())).toBe(true)
    expect(Array.from(s.get())).toEqual([1, 2, 3])
  })

  it('updates set values', () => {
    const s = set([1, 2])
    s.set([3, 4])
    expect(Array.from(s.get())).toEqual([3, 4])
  })

  it('mutates set values', () => {
    const s = set([1, 2])
    s.mutate((set) => {
      set.add(3)
    })
    expect(Array.from(s.get())).toEqual([1, 2, 3])
  })

  it('notifies subscribers on update', () => {
    const s = set([1])
    let receivedValue = new Set()
    s.on((value) => {
      receivedValue = value
    })
    s.set([2])
    expect(Array.from(receivedValue)).toEqual([2])
  })

  it('stops notifying after unsubscribe', () => {
    const s = set([1])
    let calls = 0
    const unsubscribe = s.on(() => {
      calls++
    })
    s.set([2])
    unsubscribe()
    s.set([3])
    expect(calls).toBe(1)
  })

  it('creates an empty set by default', () => {
    const s = set()
    expect(isSet(s.get())).toBe(true)
    expect(s.get().size).toBe(0)
  })
})
