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

export const defer = <T = void>() => {
  const resolve: (value: T | (() => Promise<T>)) => void = () => undefined
  const reject: (reason?: unknown) => void = () => undefined

  const promise = new Promise<T>((res, rej) => ({
    resolve: res,
    reject: rej
  }))

  promise.catch((error) => error)

  return {
    promise,
    resolve,
    reject
  }
}
