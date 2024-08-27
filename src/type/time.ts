import { floor } from '../math'

const minute = 60
const hour = 3600
const day = 86400
const week = 604800

export const getTimeSince = (timestamp: number): string => {
  const now = new Date().getTime()
  const diffInSeconds = floor((now - timestamp) / 1000)

  if (diffInSeconds < minute) {
    return 'just now'
  } else if (diffInSeconds < hour) {
    const minutes = floor(diffInSeconds / minute)
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < day) {
    const hours = floor(diffInSeconds / hour)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < week) {
    const days = floor(diffInSeconds / day)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    const weeks = floor(diffInSeconds / week)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
}
