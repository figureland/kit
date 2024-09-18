import { describe, it, expect } from 'bun:test'
import { sum, lastInArray, average, median, mean } from '../array'

describe('array', () => {
  const testArr = [1, 2, 3, 4, 5]

  it('sum should return the sum of all numbers in an array', () => {
    const result = sum(testArr)
    expect(result).toBe(15)
  })

  it('lastInArray should return the last element of an array', () => {
    const result = lastInArray(testArr)
    expect(result).toBe(5)
  })

  it('average should return the average of all numbers in an array', () => {
    const result = average(testArr)
    expect(result).toBe(3)
  })

  it('median should return the median of all numbers in an array', () => {
    const result = median(testArr)
    expect(result).toBe(3)

    const evenArr = [1, 2, 3, 4]
    const evenResult = median(evenArr)
    expect(evenResult).toBe(2.5)
  })

  it('mean should return the mean of all numbers in an array', () => {
    const result = mean(testArr)
    expect(result).toBe(3)
  })

  it('functions should handle empty arrays', () => {
    const emptyArr: number[] = []
    expect(sum(emptyArr)).toBe(0)
    expect(lastInArray(emptyArr)).toBeUndefined()
    expect(average(emptyArr)).toBeNaN()
    expect(median(emptyArr)).toBeNaN()
    expect(mean(emptyArr)).toBeNaN()
  })
})
