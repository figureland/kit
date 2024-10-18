import { state, type Factory } from '.'
import { extend } from '../tools/object'

export const factory = <Input extends any, Instance extends any = any, Output extends any = any>(
  constructor: (v: Input) => Instance,
  {
    set,
    get
  }: { set: (i: { value: Instance }, v: Input) => Instance | void; get: (v: Instance) => Output }
): Factory<Input, Instance, Output> => {
  return (v: Input) => {
    const store = {
      value: constructor(v)
    }

    const s = state(get(store.value))

    const setValue = (v: Input) => {
      set(store, v)
      s.set(get(store.value))
    }

    return extend(s, {
      set: setValue,
      derived: <DerivedResult extends any>(fn: (v: Instance) => DerivedResult) =>
        s.use(
          state((gt) => {
            gt(s)
            return fn(store.value)
          })
        ),
      instance: () => store.value
    })
  }
}
