import { createSubscriptions } from './subscriptions'
import type { Disposable } from './api'

export class Store {
  private keyedSubs = new Map<string | number | symbol, Disposable>()
  private disposables = createSubscriptions()

  use = <S extends Disposable | (() => void)>(s: S): S => {
    this.disposables.add('dispose' in s ? s.dispose : s)
    return s
  }

  unique = <S extends Disposable>(key: string | number | symbol, s: () => S): S => {
    if (this.keyedSubs.has(key)) {
      return this.keyedSubs.get(key) as S
    } else {
      const instance = this.use(s())
      this.keyedSubs.set(key, instance)
      return instance
    }
  }

  dispose = (): void => {
    this.disposables.each()
    this.disposables.dispose()
    this.keyedSubs.clear()
  }
}

export const store = () => new Store()

export const disposable = (dispose: () => void): Disposable => ({
  dispose
})
