export const isFulfilled = <T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => result.status === 'fulfilled'

export const isRejected = <T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult =>
  result.status === 'rejected'

export const parseSettled = <T>(results: PromiseSettledResult<T>[]) => ({
  rejected: results.filter(isRejected),
  fulfilled: results.filter(isFulfilled).map((i) => i.value)
})

export const settle = async <T>(promises: Promise<T>[]) => {
  const results = await Promise.allSettled(promises)
  return parseSettled(results)
}

export async function collect<T>(asyncGenerator: AsyncGenerator<T>): Promise<T[]> {
  const result: T[] = []
  for await (const item of asyncGenerator) {
    result.push(item)
  }
  return result
}
