export type Unsubscribe = () => void

export type Subscription<T extends any = any> = (value: T) => void

/**
 * Creates a managed list of subscriptions and unsubscribe functions
 */
export const createSubscriptions = <S extends Subscription = Subscription>(): Subscriptions<S> => {
  const listeners: Set<S> = new Set()

  const deleteSub = (...sub: S[]) => {
    for (const s of sub) {
      listeners.delete(s)
    }
  }

  const add = (...sub: S[]) => {
    for (const s of sub) {
      listeners.add(s)
    }
    return () => deleteSub(...sub)
  }

  const dispose = () => {
    listeners.clear()
  }

  const each = (v?: any) => {
    for (const sub of listeners) {
      if (sub) sub(v)
    }
  }

  return {
    add,
    dispose,
    delete: deleteSub,
    each,
    size: () => listeners.size
  }
}

export type Subscriptions<S extends Subscription = Subscription> = {
  add: (...sub: S[]) => Unsubscribe
  dispose: () => void
  delete: (...sub: S[]) => void
  each: (value?: any) => void
  size: () => number
}

/**
 * Creates a managed list of subscriptions grouped by topic
 */
export const createTopicSubscriptions = <
  T extends string | number | symbol = string | number | symbol
>(): TopicSubscriptions<T> => {
  const topics = new Map<T, Subscriptions>()

  const add = (topic: T, ...sub: Subscription[]): Unsubscribe => {
    if (topics.get(topic)) {
      topics.get(topic)?.add(...sub)
    } else {
      topics.set(topic, createSubscriptions())
      topics.get(topic)?.add(...sub)
    }

    return () => {
      for (const s of sub) {
        topics.get(topic)?.delete(s)
      }
    }
  }

  const dispose = () => {
    for (const [, sub] of topics) {
      sub.dispose()
    }
    topics.clear()
  }

  const each = (topic: T, value: any) => {
    topics.get(topic)?.each(value)
  }

  return {
    add,
    dispose,
    each,
    size: () => {
      let count = 0
      for (const [, sub] of topics) {
        count += sub.size()
      }
      return count
    }
  }
}

export type TopicSubscriptions<T extends string | number | symbol> = {
  add: (topic: T, ...sub: Subscription[]) => Unsubscribe
  dispose: () => void
  each: (topic: T, value: any) => void
  size: () => number
}
