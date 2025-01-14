import { State, state, type Wrap, type Wrapped, extend } from '.'

export type WrappedInstance<T> = {
  value: T
}

export const wrap = <Input extends any, Instance extends any = any, Output = Instance>(
  create: (v: Input, trigger?: () => void) => Instance,
  {
    set = (i: WrappedInstance<Instance>, value: Input) => {
      i.value = create(value) as Instance
    },
    get = (i: WrappedInstance<Instance>): Output => i.value as unknown as Output,
    onCreate
  }: {
    set?: (i: WrappedInstance<Instance>, value: Input) => void
    get?: (i: WrappedInstance<Instance>) => Output
    onCreate?: (i: WrappedInstance<Instance>, s: State<Output>) => void
  } = {}
): Wrap<Input, Instance, Output> => {
  return (v: Input): Wrapped<Input, Instance, Output> => {
    const instance: WrappedInstance<Instance> = {
      value: create(v)
    }

    const s = state(get(instance))

    const extended = extend(s, {
      set: (v: Input) => {
        set(instance, v)
        s.set(get(instance))
      },
      derive: <DerivedResult extends any>(fn: (v: Instance) => DerivedResult) =>
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
