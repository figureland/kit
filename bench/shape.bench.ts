import { bench, boxplot, run } from 'mitata'
import { shape } from '../src/state'

boxplot(() => {
  bench('Initialize Shape', () => {
    const s = shape({ a: 1, b: 'test' })
  })

  bench('Get Shape Value', () => {
    const s = shape({ a: 1, b: 'test' })
    s.get()
  })

  bench('Set Single Key', () => {
    const s = shape({ a: 1, b: 'test' })
    s.key('a').set(2)
  })

  bench('Get Single Key', () => {
    const s = shape({ a: 1, b: 'test' })
    s.key('a').get()
  })

  bench('Set Multiple Values', () => {
    const s = shape({ a: 1, b: 'test' })
    s.set({ a: 2, b: 'updated' })
  })

  bench('Subscribe to Updates', () => {
    const s = shape({ a: 1, b: 'test' })
    s.on(() => {})
    s.set({ a: 2 })
  })

  bench('Partial Updates', () => {
    const s = shape({ a: 1, b: 'test', c: true })
    s.set({ b: 'updated' })
  })
})
