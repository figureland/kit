const hasPlatform = () => typeof navigator !== 'undefined' && navigator.platform
const hasUserAgent = () => typeof navigator !== 'undefined' && navigator.userAgent

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
  const p = typeof navigator === 'object' ? navigator.platform : ''
  return /Mac|iPod|iPhone|iPad/.test(p)
}

export const getPlatform = () => {
  if (!hasUserAgent()) return false
  const platform = navigator.platform.toLowerCase()
  const userAgent = navigator.userAgent.toLowerCase()

  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac'
  } else if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows'
  } else if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux'
  }
  return false
}

export const isTouchscreen = () => hasUserAgent() && window.matchMedia('(pointer: coarse)').matches
