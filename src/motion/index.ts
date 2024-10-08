import { type AnimatedState, type Events, type State, events, system, state } from '../state'
import { clamp, mapRange } from '../math/number'
import { isObject } from '../tools/guards'
import { isBrowser } from '../dom'

type AnimatedEvents = {
  start: void
  stop: void
  tick: number
  dispose: void
}

export const animation = ({ fps = 60 }: { fps?: number; epsilon?: number } = {}): Animated => {
  const { use, dispose } = system()
  const active = use(state(() => false))
  const e = use(events<AnimatedEvents>())
  const animations: Set<AnimatedState<any>> = new Set()

  const timestep: number = 1000 / fps
  let lastTimestamp: number = 0
  let delta: number = 0

  const start = () => {
    active.set(true)
    e.emit('start', undefined)
  }

  const stop = () => {
    active.set(false)
    e.emit('stop', undefined)
  }

  const tick = (timestamp: number) => {
    const a = active.get()
    if (animations.size === 0 || !a) {
      if (a) active.set(false)
      return
    }
    if (timestamp - lastTimestamp < timestep) {
      return
    }
    delta = timestamp - lastTimestamp
    lastTimestamp = timestamp

    for (const a of animations) {
      a.tick(delta)
    }
    e.emit('tick', delta)
  }

  return {
    active,
    start,
    stop,
    dispose: () => {
      active.set(false)
      dispose()
      animations.clear()
      e.emit('dispose', undefined)
    },
    tick,
    events: e,
    animated: <V>(s: State<V>, options: AnimatedStateOptions<V>): AnimatedState<V> => {
      const a = use(createAnimated(s, options))
      animations.add(a)
      a.events.on('dispose', () => animations.delete(a))
      if (!active.get()) start()
      return a
    }
  }
}

export type Animated = {
  active: State<boolean>
  tick: (timestamp: number) => void
  start: () => void
  stop: () => void
  dispose: () => void
  events: Events<AnimatedEvents>
  animated: <V>(s: State<V>, options: AnimatedStateOptions<V>) => AnimatedState<V>
}

export const createAnimated = <V extends any>(
  raw: State<V>,
  { duration = 500, easing = (v) => v, interpolate, epsilon = 16 }: AnimatedStateOptions<V>
): AnimatedState<V> => {
  const m = system()
  const clone = m.use(
    state(raw.get, {
      equality: () => false
    })
  )
  m.use(
    raw.events.on('dispose', () => {
      m.dispose()
    })
  )

  const store = {
    target: raw.get(),
    active: false,
    progress: 0.0
  }

  const objectLike = isObject(store.target)

  const tick = (delta: number) => {
    store.progress = clamp(store.progress + delta, 0, duration)
    const finished = store.progress === duration || duration - store.progress < epsilon

    if (!finished || store.active) {
      const amount = easing(mapRange(store.progress, 0, duration, 0, 1))
      objectLike
        ? clone.mutate((d) => {
            d = interpolate(d, store.target, amount)
          }, true)
        : clone.set((d) => interpolate(d, store.target, amount), true)
      store.active = !finished
    }
  }

  raw.on((v) => {
    store.progress = 0
    store.target = v
    store.active = true
    tick(0)
  })

  const set = (v: V | Partial<V> | ((v: V) => V | Partial<V>), sync: boolean = true) => {
    store.progress = 1.0
    clone.set(v, sync)
    store.target = clone.get()
    store.active = false
  }

  return {
    id: clone.id,
    use: m.use,
    get: clone.get,
    on: clone.on,
    set,
    mutate: raw.mutate,
    tick,
    events: clone.events,
    dispose: m.dispose
  }
}

type InterpolationFn<V> = (from: V, to: V, amount: number) => V

type AnimatedStateOptions<V> = {
  duration?: number
  interpolate: InterpolationFn<V>
  easing?: (p: number) => number
  epsilon?: number
}

export const loop = (e: Animated, { autoStart = true }: { autoStart?: boolean } = {}) => {
  let raf: number
  const browser = isBrowser()
  const stop = () => {
    if (browser) cancelAnimationFrame(raf)
  }
  const run = () => {
    if (browser) raf = requestAnimationFrame(loop)
  }
  const loop = (timestamp: number) => {
    e.tick(timestamp)
    run()
  }

  e.events.on('start', run)
  e.events.on('stop', stop)
  e.events.on('dispose', stop)
  if (autoStart) e.start()
  return e
}
