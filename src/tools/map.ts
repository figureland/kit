export const sortMapToArray = <O extends object, K extends keyof O & string>(
  map: Map<string, O>,
  prop: K
): O[] =>
  Array.from(map.values()).sort((a, b) => {
    const aValue = String(a[prop])
    const bValue = String(b[prop])
    return aValue.localeCompare(bValue)
  })
