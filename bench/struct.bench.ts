import { bench, boxplot, run } from 'mitata'
import { struct } from '../src/state'

boxplot(() => {
  bench('Initialize Struct', () => {
    const s = struct({ a: 1, b: 'test' })
  })

  bench('Get Struct Value', () => {
    const s = struct({ a: 1, b: 'test' })
    s.get()
  })

  bench('Set Single Key', () => {
    const s = struct({ a: 1, b: 'test' })
    s.key('a').set(2)
  })

  bench('Get Single Key', () => {
    const s = struct({ a: 1, b: 'test' })
    s.key('a').get()
  })

  bench('Set Multiple Values', () => {
    const s = struct({ a: 1, b: 'test' })
    s.set({ a: 2, b: 'updated' })
  })

  bench('Subscribe to Updates', () => {
    const s = struct({ a: 1, b: 'test' })
    s.on(() => {})
    s.set({ a: 2 })
  })

  bench('Partial Updates', () => {
    const s = struct({ a: 1, b: 'test', c: true })
    s.set({ b: 'updated' })
  })
})
