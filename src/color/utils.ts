import { isBrowser } from '../dom'

export const isDisplayP3Supported = (): boolean => {
  if (!isBrowser()) {
    return false
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return false
  }

  const colorSpace = (context as any).getContextAttributes()?.colorSpace
  return colorSpace === 'display-p3'
}
