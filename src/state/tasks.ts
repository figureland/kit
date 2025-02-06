import { type Events, events, manager, type State, state } from '../state'
import { freeze } from '../tools/object'

type TaskEvents = {
  [key: string]: void
  dispose: void
}

type TaskOptions = {
  interval: number
  count?: number
}

export type Task = {
  id: string
  dispose: () => void
  active: State<boolean>
  count: State<number>
}

export type Tasks = {
  add: (id: string, fn: () => void, options: TaskOptions) => Task
  dispose: () => void
  events: Events<TaskEvents>
}

export const tasks = (): Tasks => {
  const { use, dispose: managerDispose } = manager()
  const e = use(events<TaskEvents>())
  const activeTasks = new Set<Task>()

  const createTask = (
    id: string,
    fn: () => void,
    { interval, count = Infinity }: TaskOptions
  ): Task => {
    const m = manager()
    const active = m.use(state(true))
    const remaining = m.use(state(count))
    let timer: Timer

    const runTask = () => {
      if (!active.get() || remaining.get() <= 0) {
        return
      }

      fn()
      e.emit(id, undefined)

      if (count !== Infinity) {
        remaining.set((c) => c - 1)
      }

      if (remaining.get() > 0) {
        timer = setTimeout(runTask, interval)
      } else {
        active.set(false)
      }
    }

    timer = setTimeout(runTask, interval)

    const task: Task = freeze({
      id,
      active,
      count: remaining,
      dispose: () => {
        clearTimeout(timer)
        active.set(false)
        m.dispose()
        activeTasks.delete(task)
      }
    })

    return task
  }

  return freeze({
    add: (id: string, fn: () => void, options: TaskOptions) => {
      const task = createTask(id, fn, options)
      activeTasks.add(task)
      return task
    },
    dispose: () => {
      for (const task of activeTasks) {
        task.dispose()
      }
      activeTasks.clear()
      e.emit('dispose', undefined) // Added this line
      managerDispose()
    },
    events: e
  })
}
