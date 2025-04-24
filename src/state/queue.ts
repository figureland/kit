import {
  type State,
  type Events,
  type StateOptions,
  store,
  state,
  events,
  extend
} from '../state'

export type QueueEvents<T> = {
  enqueue: T
  dequeue: T
  clear: void
}

export type Queue<T> = State<T[]> & {
  enqueue: (item: T) => void
  dequeue: () => T | undefined
  peek: () => T | undefined
  clear: () => void
  events: Events<QueueEvents<T>>
}

export const queue = <T>({
  maxSize,
  throttle
}: { maxSize?: number } & Pick<StateOptions<T[]>, 'throttle'> = {}): Queue<T> => {
  const { use, dispose } = store()

  const items = use(state<T[]>([], { throttle }))
  const e = use(events<QueueEvents<T>>())

  const enqueue = (item: T) => {
    items.mutate((queue) => {
      queue.push(item)
      if (maxSize && queue.length > maxSize) {
        queue.shift()
      }
    })
    e.emit('enqueue', item)
  }

  const dequeue = () => {
    const item = items.get()[0]
    if (item) {
      items.mutate((queue) => {
        queue.shift()
      })
      e.emit('dequeue', item)
    }
    return item
  }

  const peek = () => items.get()[0]

  const clear = () => {
    items.set([])
    e.emit('clear', undefined)
  }

  return extend(items, {
    enqueue,
    dequeue,
    peek,
    clear,
    events: e,
    dispose
  })
}
