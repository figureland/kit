export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export const lastInArray = <T>(arr: T[]) => arr[arr.length - 1]

export const average = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

export const median = (arr: number[]) => {
  const mid = Math.floor(arr.length / 2)
  const sorted = arr.sort((a, b) => a - b)
  return arr.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export const mean = (arr: number[]) => sum(arr) / arr.length
