import { State, state, type Wrap } from '.'
import { extend } from '../tools/object'

type WrappedInstance<T> = {
  value: T
}

export const wrap = <Input extends any, Instance extends any = any, Output extends any = any>(
  create: (v: Input, trigger?: () => void) => Instance,
  {
    set,
    get,
    onCreate
  }: {
    set: (i: WrappedInstance<Instance>, value: Input) => void
    get: (i: WrappedInstance<Instance>) => Output
    onCreate?: (i: WrappedInstance<Instance>, s: State<Output>) => void
  }
): Wrap<Input, Instance, Output> => {
  return (v: Input) => {
    const instance: WrappedInstance<Instance> = {
      value: create(v)
    }

    const s = state(get(instance))

    const extended = extend(s, {
      set: (v: Input) => {
        set(instance, v)
        s.set(get(instance))
      },
      derived: <DerivedResult extends any>(fn: (v: Instance) => DerivedResult) =>
        s.use(
          state((gt) => {
            gt(s)
            return fn(instance.value)
          })
        ),
      instance: () => instance.value
    })

    if (onCreate) onCreate(instance, s)

    return extended
  }
}
