import { type State, type Events, lifecycle, state, events } from '../state'
import { extend } from './state'

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

export type QueueOptions = {
  maxSize?: number
  throttle?: number
}

export const queue = <T>(options: QueueOptions = {}): Queue<T> => {
  const { maxSize = 100, throttle } = options
  const { use, dispose } = lifecycle()

  const items = use(state<T[]>([], { throttle }))
  const e = use(events<QueueEvents<T>>())

  const enqueue = (item: T) => {
    items.mutate((queue) => {
      queue.push(item)
      if (queue.length > maxSize) {
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
