import { error } from '../services/alerts'
import { DATACAKES_CODE_SERVICE_URL } from '../config/main'

export const randomString = () => {
  return Math.random().toString(36).slice(2)
}

export const handleError = (e: any) => {
  if (e !== null) {
    if (e.name === 'CanceledError') {
      error('Request cancelled by user')
      return
    }
    if (e.response?.data?.display) {
      error(e.response?.data?.display)
    } else if (e.response?.data?.message) {
      error(e.response?.data?.message)
    } else {
      error(e.message)
    }
    return
  }
  error('An error has occurred. Please let the app developers know.')
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
