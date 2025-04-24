import { bench, boxplot } from 'mitata'
import { state } from '../src/state'

boxplot(() => {
  bench('Initialize state with primitive', () => {
    const s = state(0)
  })

  bench('Initialize state with object', () => {
    const s = state({ count: 0 })
  })

  bench('Set state with primitive', () => {
    const s = state(0)
    s.set(1)
  })

  bench('Set state with object', () => {
    const s = state({ count: 0 })
    s.set({ count: 1 })
  })

  bench('Get state', () => {
    const s = state(0)
    s.get()
  })

  bench('Mutate state', () => {
    const s = state(0)
    s.mutate((v) => v + 1)
  })

  bench('Throttle state updates', () => {
    const s = state(0, { throttle: 100 })
    s.set(1)
    s.set(2)
  })

  bench('Track dependencies', () => {
    const depstate = state(0)
    const s = state(() => depstate.get() + 1)
    depstate.set(1)
    s.get()
  })
})
