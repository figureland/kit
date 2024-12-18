import { events, shape, manager, type Events, type Shape, type Unsubscribe } from '../state'
import { isBrowser } from '.'

type TimerEvent = {
  start: number
  finish: number
  duration: number
}

type TimerState = {
  event: TimerEvent | undefined
  active: boolean
}

type TimerEvents = {
  tick: number
}

export const timer = (): Timer => {
  let startTime: number = 0
  let active = false

  const { use, dispose } = manager()
  const state = use(
    shape<TimerState>({
      active: false,
      event: undefined
    })
  )
  const e = use(events<TimerEvents>())

  const stop = (): TimerEvent | undefined => {
    if (active) {
      const finishTime = performance.now()
      const duration = finishTime - startTime
      const event = {
        start: startTime,
        finish: finishTime,
        duration
      }
      state.set({
        active: false,
        event
      })
    }
    return state.get().event
  }

  const tick = () => {
    if (active) {
      e.emit('tick', performance.now() - startTime)
    }
  }

  const start = () => {
    active = true
    startTime = performance.now()
    state.set({
      active: true
    })
  }

  return {
    state,
    get: () => state.get().event,
    on: e.on,
    start,
    stop,
    tick,
    dispose
  }
}

export type Timer = {
  state: Shape<TimerState>
  get: () => TimerEvent | undefined
  on: Events<TimerEvents>['on']
  start: () => void
  stop: () => TimerEvent | undefined
  tick: () => void
  dispose: Unsubscribe
}

export const timerLoop = (t: Timer) => {
  let raf!: number
  let active = false

  const stop = () => {
    if (isBrowser && active) {
      cancelAnimationFrame(raf)
      active = false
    }
  }

  const start = () => {
    if (!active) {
      active = true
      loop()
    }
  }

  const loop = () => {
    t.tick()
    if (isBrowser) raf = requestAnimationFrame(loop)
  }

  t.state.key('active').on((e) => {
    if (e) {
      start()
    } else {
      stop()
    }
  })

  t.state.events.on('dispose', stop)
  return t
}
