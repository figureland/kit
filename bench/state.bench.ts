import { bench, boxplot } from 'mitata'
import { state } from '../src/state'

boxplot(() => {
  bench('Initialize State with Primitive', () => {
    const s = state(0)
  })

  bench('Initialize State with Object', () => {
    const s = state({ count: 0 })
  })

  bench('Set State with Primitive', () => {
    const s = state(0)
    s.set(1)
  })

  bench('Set State with Object', () => {
    const s = state({ count: 0 })
    s.set({ count: 1 })
  })

  bench('Get State', () => {
    const s = state(0)
    s.get()
  })

  bench('Mutate State', () => {
    const s = state(0)
    s.mutate((v) => v + 1)
  })

  bench('Throttle State Updates', () => {
    const s = state(0, { throttle: 100 })
    s.set(1)
    s.set(2)
  })

  bench('Track Dependencies', () => {
    const depState = state(0)
    const s = state(() => depState.get() + 1)
    depState.set(1)
    s.get()
  })
})
