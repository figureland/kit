import { describe, it, expect, mock } from 'bun:test'
import { effect, state, events } from '..'
import { isNumber } from '../../ts/guards'

describe('effect', () => {
  it('creates an effect which listens to other streams of events', () => {
    const exampleEvents = events<{ something: number; else: string[] }>()
    const exampleState = state(() => 10)

    const mockSub = mock(() => ({}))

    effect([exampleEvents, exampleState], mockSub)
    exampleEvents.emit('something', 10)
    exampleState.set(20)

    expect(mockSub).toHaveBeenCalledTimes(2)
  })
  it('receives values from events', () => {
    const exampleEvents = events<{ something: number; else: string[] }>()
    const exampleState = state(() => 10)

    let num: number = 0
    let other: string[] = []

    const mockSub = mock(() => ({}))
    effect([exampleEvents, exampleState], ([e]) => {
      mockSub()
      if (e) {
        const value = e[1]
        if (isNumber(value)) {
          num = value
        } else {
          other = value
        }
      }
    })

    exampleEvents.emit('something', 10)
    exampleEvents.emit('else', ['test'])

    expect(num).toBe(10)
    expect(other).toEqual(['test'])
    expect(mockSub).toHaveBeenCalledTimes(2)

    exampleState.set(20)
    expect(mockSub).toHaveBeenCalledTimes(3)
  })
  it('disposes properly', () => {
    const exampleEvents = events<{ something: number; else: string[] }>()
    const exampleState = state(() => 10)

    const mockSub = mock(() => ({}))
    const mockDispose = mock(() => ({}))

    const e = effect([exampleEvents, exampleState], mockSub)
    e.use(mockDispose)
    exampleEvents.emit('something', 10)
    exampleState.set(20)
    expect(mockSub).toHaveBeenCalledTimes(2)
    e.dispose()

    exampleState.set(20)
    expect(mockSub).toHaveBeenCalledTimes(2)
    expect(mockDispose).toHaveBeenCalledTimes(1)
  })
  it('triggers as expected', () => {
    const exampleEvents = events<{ something: number; else: string[] }>()
    const exampleState = state(() => 10)

    const mockSub = mock(() => ({}))

    effect([exampleEvents, exampleState], mockSub, { trigger: true })

    expect(mockSub).toHaveBeenCalledTimes(1)
  })
})
