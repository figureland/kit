import { Effect, Events, State } from './api'
import { system } from './system'

type SourceValue<S> =
  S extends State<infer V>
    ? V
    : S extends Events<infer E, infer K>
      ? [K, E[keyof E]] | undefined
      : never

export const effect = <S extends (State<any> | Events<any>)[]>(
  sources: [...S],
  callback: (values: { [K in keyof S]: SourceValue<S[K]> }) => void,
  { trigger, throttle }: { trigger?: boolean; throttle?: number } = {}
): Effect => {
  const { use, dispose } = system()

  let lastExecutionTime = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const clearScheduledTimeout = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const updateValues = (triggeredEvent?: [keyof any, any]) => {
    const now = performance.now()

    const executeCallback = () => {
      clearScheduledTimeout()

      const values = sources.map((source, index) => {
        if ('get' in source) {
          return source.get()
        } else if (triggeredEvent && index === sources.indexOf(source)) {
          return triggeredEvent
        } else {
          return undefined
        }
      }) as { [K in keyof S]: SourceValue<S[K]> }

      callback(values)
      lastExecutionTime = now
    }

    if (throttle) {
      const timeSinceLastExecution = now - lastExecutionTime
      if (timeSinceLastExecution >= throttle) {
        executeCallback()
      } else {
        clearScheduledTimeout()
        timeoutId = setTimeout(executeCallback, throttle - timeSinceLastExecution)
      }
    } else {
      executeCallback()
    }
  }

  sources.forEach((source) => {
    if ('get' in source) {
      use(source.on(() => updateValues()))
    } else if ('all' in source) {
      use(source.all(updateValues))
    }
  })

  if (trigger) {
    updateValues()
  }

  use(() => clearScheduledTimeout)

  return {
    use,
    dispose
  }
}
