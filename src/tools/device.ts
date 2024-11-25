const hasNavigator = () => typeof navigator !== 'undefined'

const hasPlatform = () => hasNavigator() && navigator.platform
const hasUserAgent = () => hasNavigator() && navigator.userAgent

export const isChrome = () => {
  const userAgent = hasUserAgent()
  return userAgent ? userAgent.includes('Chrome') || userAgent.includes('Chromium') : false
}

export const isSafari = (): boolean => {
  const userAgent = hasUserAgent()
  if (!userAgent || isChrome()) {
    return false
  }
  const isSafari = userAgent.includes('Safari')
  return isSafari
}

export const isMobile = (): boolean => {
  const userAgent = hasUserAgent()
  return userAgent
    ? /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    : false
}

export const isApple = () => {
  if (!hasPlatform()) return false
  const p = hasNavigator() ? navigator.platform : ''
  return /Mac|iPod|iPhone|iPad/.test(p)
}

export type Platform = 'mac' | 'windows' | 'linux' | undefined

export const getPlatform = (): Platform => {
  if (!hasUserAgent()) return

  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac'
  } else if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  } else if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }
  return
}

export const isTouchscreen = () => hasUserAgent() && window.matchMedia('(pointer: coarse)').matches
