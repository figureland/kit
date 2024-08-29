export const isString = (n: unknown): n is string => typeof n === 'string'

export const isBrowser = () => typeof window !== 'undefined'
