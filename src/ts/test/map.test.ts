import { describe, it, expect } from 'bun:test'
import { sortMapToArray, NiceMap } from '../map'

describe('sortMapToArray', () => {
  it('sorts array of map values by a specified property', () => {
    const map = new Map<string, { name: string; age: number }>()
    map.set('a', { name: 'Alice', age: 25 })
    map.set('b', { name: 'Bob', age: 20 })
    map.set('c', { name: 'Charlie', age: 30 })

    const sortedArray = sortMapToArray(map, 'name')
    expect(sortedArray.map((item) => item.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    const sortedArrayByAge = sortMapToArray(map, 'age')
    expect(sortedArrayByAge.map((item) => item.age)).toEqual([20, 25, 30])
  })
})

describe('NiceMap', () => {
  it('returns existing value for a key', () => {
    const niceMap = new NiceMap<string, number>()
    niceMap.set('key1', 100)
    expect(niceMap.getOrSet('key1', () => 999)).toBe(100)
  })

  it('sets and returns new value for a key if it does not exist', () => {
    const niceMap = new NiceMap<string, number>()
    expect(niceMap.getOrSet('key2', () => 200)).toBe(200)
    expect(niceMap.get('key2')).toBe(200)
  })
})
