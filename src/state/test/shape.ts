import { describe, it, expect } from 'bun:test'
import { shape } from '..'

describe('shape', () => {
  it('creates a shape and retrieves its initial values', () => {
    const initialObj = { a: 1, b: 'test' }
    const objState = shape(initialObj)
    expect(objState.get()).toEqual(initialObj)
  })
  it('sets and gets a single state value', () => {
    const objState = shape({ a: 1, b: 'test' })
    objState.key('a').set(2)
    expect(objState.key('a').get()).toBe(2)
  })
  it('globally sets and gets updated values', () => {
    const objState = shape({ a: 1, b: 'initial' })
    objState.set({ a: 2, b: 'updated' })
    expect(objState.get()).toEqual({ a: 2, b: 'updated' })
  })
  it('notifies subscribers on any state update', () => {
    const objState = shape({ a: 1, b: 'initial' })
    let receivedObj!: Partial<{ a: number; b: string }>
    objState.on((updatedObj) => {
      receivedObj = updatedObj
    })
    objState.set({ a: 2 })
    expect(receivedObj).toEqual({ a: 2, b: 'initial' })
  })
  it('disposes of all states and stops notifications', () => {
    const objState = shape({ a: 1, b: 'initial' })
    let calls = 0
    objState.on(() => {
      calls += 1
    })
    objState.dispose()
    objState.set({ a: 2 })
    expect(calls).toBe(0)
  })
  it('handles partial updates correctly', () => {
    const objState = shape({ a: 1, b: 'initial', c: true })
    objState.set({ b: 'updated' })
    expect(objState.get()).toEqual({ a: 1, b: 'updated', c: true })
  })
})
