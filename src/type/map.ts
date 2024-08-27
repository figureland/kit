export const sortMapToArray = <O extends object, K extends keyof O & string>(
  map: Map<string, O>,
  prop: K
): O[] =>
  Array.from(map.values()).sort((a, b) => {
    const aValue = String(a[prop])
    const bValue = String(b[prop])
    return aValue.localeCompare(bValue)
  })

export class NiceMap<K, V> extends Map<K, V> {
  private counter = new Map<K, number>()
  public getOrSet = <Value extends V>(key: K, fn: () => Value) => {
    if (this.has(key)) {
      this.counter.set(key, (this.counter.get(key) || 0) + 1)
      return this.get(key) as Value
    } else {
      const v = fn()
      this.counter.set(key, 0)
      this.set(key, v)
      return v
    }
  }
  public getOrSetCount = (key: K) => this.counter.get(key) || 0
}
