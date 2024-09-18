import { error } from '../services/alerts'
import { DATACAKES_CODE_SERVICE_URL, DATACAKES_SOURCE_SERVICE_URL, LOGIN_URL } from '../config/main'
import { IDataObject } from '../types/source_service/IDataObject'
// Icons
import BIGQUERY from '../../assets/Svgs/datasources/Bigquery.svg'
import CSV from '../../assets/Svgs/datasources/CSV.svg'
import SNOWFLAKE from '../../assets/Svgs/datasources/Snowflake.svg'
import META from '../../assets/Svgs/datasources/Meta.svg'
import GOOGLEADS from '../../assets/Svgs/datasources/google-ads.svg'
import GOOGLEANALYTICS from '../../assets/Svgs/datasources/google-analytics.svg'
import DATACAKES from '../../assets/datacakes-sq.png'

export const redirectFromStandaloneUrl = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search)
  const standalone = urlParams.get('standalone')
  return Boolean(JSON.parse(standalone as string))
}

export const getCakeIdFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search)

  const cakeId = urlParams.get('cakeID') || urlParams.get('cake_id') || urlParams.get('cakeId') || ''

  return cakeId
}

export const isEndUserView = (): boolean => {
  return getCakeIdFromUrl() != ''
}

export const getCodeSvcURL = (): string => {
  const urlParams = new URLSearchParams(window.location.search)
  const codesvc = urlParams.get('codesvc')
  if (codesvc) return codesvc
  else return DATACAKES_CODE_SERVICE_URL
}

export const getSrcSvcURL = (): string => {
  const urlParams = new URLSearchParams(window.location.search)
  const srcsvc = urlParams.get('srcsvc')
  if (srcsvc) return srcsvc
  else return DATACAKES_SOURCE_SERVICE_URL
}

export const hasOpenModalFlagInUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const openModal = urlParams.get('openModal') || 0
  return Number(openModal)
}

export const hasConfirmationFlagInUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const confirmed = urlParams.get('confirmation') != null
  return Boolean(confirmed)
}

export const hasTourFlagInUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const tour = urlParams.get('tour') != null
  return Boolean(tour)
}

export const retrieveSourceParam = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const source = urlParams.get('source') || ''
  console.log("source", source)
  return source
}

export const retrieveSourceIdParam = () => {
  const urlParams = new URLSearchParams(window.location.search)

  const sourceId = urlParams.get('sourceId') || ''
  console.log("sourceId", sourceId)
  return sourceId
}

export const redirectToCakeId = (cakeId: string) => {
  window.location.search = 'cakeID=' + cakeId
}

export const randomString = () => {
  return Math.random().toString(36).slice(2)
}

export const handleError = (e: any) => {
  if (e !== null) {
    if (e.name === 'CanceledError') {
      error('Request cancelled by user')
      return
    }
    if (e.response?.data?.instruction == 'login')
      window.open(LOGIN_URL, '_blank')
    else {
      if (e.response?.data?.display) {
        error(e.response?.data?.display)
      } else if (e.response?.data?.message) {
        error(e.response?.data?.message)
      } else {
        error(e.message)
      }
    }
    return
  }
  error('An error has occurred. Please let the app developers know.')
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function areArraysEqual(array1: IDataObject[], array2: IDataObject[]) {
  if (array1.length !== array2.length) {
    return false
  }

  function isObjectEqual(obj1: IDataObject, obj2: IDataObject) {
    return obj1.table_full_id === obj2.table_full_id
  }

  for (let i = 0; i < array1.length; i++) {
    let found = false
    for (let j = 0; j < array2.length; j++) {
      if (isObjectEqual(array1[i], array2[j])) {
        found = true
        break
      }
    }
    if (!found) {
      return false
    }
  }

  return true
}

export function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export const getDataServiceIcon = (dataService: string) => {
  switch (dataService) {
    case 'bigquery':
      return BIGQUERY
    case 'csv':
      return CSV
    case 'snowflake':
      return SNOWFLAKE
    case 'meta':
      return META
    case 'googleads':
      return GOOGLEADS
    case 'googleanalytics':
      return GOOGLEANALYTICS
    case 'datacakes':
      return DATACAKES
    default:
      return DATACAKES
  }
}
