import type { Disposable, Manager } from './api'
import { createSubscriptions } from './subscriptions'

export const manager = (): Manager => {
  const keyedSubs = new Map()
  const disposables = createSubscriptions()

  const use = <S extends Disposable | (() => void)>(s: S) => {
    disposables.add('dispose' in s ? s.dispose : s)
    return s
  }

  const unique = <S extends Disposable>(key: string | number | symbol, s: () => S): S => {
    if (keyedSubs.has(key)) {
      return keyedSubs.get(key)
    } else {
      const instance = use(s())
      keyedSubs.set(key, instance)
      return instance
    }
  }

  const dispose = () => {
    disposables.each()
    disposables.dispose()
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
