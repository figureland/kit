import { getStorageName, type StorageAPI, type StorageAPIOptions } from './persist'

declare var localStorage: Storage

export const typedLocalStorage = <T>({
  name,
  validate,
  interval,
  refine,
  fallback,
  parse = JSON.parse,
  stringify = JSON.stringify
}: StorageAPIOptions<T> & { interval?: number }): StorageAPI<T> => {
  let lastUpdate: number = performance.now()

  const target = getStorageName(name)
  const set = async (v: T) => {
    const now = performance.now()

    if (!interval || now - lastUpdate >= interval) {
      const value = refine ? await refine.set(v) : v
      localStorage.setItem(target, stringify(value))
      lastUpdate = now
    }
  }
  const get = async () => {
    try {
      const result = parse(localStorage.getItem(target) || '')
      const v = refine ? await refine.get(result) : result
      const validated = await validate(v)
      if (validated) {
        return v as T
      }
      throw new Error(`Invalid value in ${target}`)
    } catch (e) {
      const fb = (await fallback()) as T
      await set(fb)
      return fb
    }
  }
  return {
    set,
    get
  }
}
