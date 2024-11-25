import { NiceMap } from '../tools/map'
import type { Disposable, Lifecycle } from './api'
import { createSubscriptions } from './subscriptions'

export const lifecycle = (): Lifecycle => {
  const keyedSubs = new NiceMap()
  const subs = createSubscriptions()

  const use = <S extends Disposable | (() => void)>(s: S) => {
    subs.add('dispose' in s ? s.dispose : s)
    return s
  }

  const unique = <S extends Disposable>(key: string | number | symbol, s: () => S) =>
    use(keyedSubs.getOrSet(key, s))

  const dispose = () => {
    subs.each()
    subs.dispose()
    keyedSubs.clear()
  }

  return {
    unique,
    use,
    dispose
  }
}

export const disposable = (dispose: () => void): Disposable => ({
  dispose
})
