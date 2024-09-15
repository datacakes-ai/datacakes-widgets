import axios, { AxiosResponse } from 'axios'
import { getCodeSvcURL } from '../utils/main'
import { TBackendResponse, TQueryBackendResponse } from '../types/TBackendResponse'
import { IAnswerResponse } from '../types/code_service/IAnswerResponse'
import { IDataObjectSet } from '../types/code_service/IDataObjectSet'
import { IFlagAnswerResponse } from '../types/code_service/IFlagAnswerResponse'
import { IInitializeRequestParams } from '../types/code_service/IInitializeRequestParams'
import { IQueryRequestParams } from '../types/code_service/IQueryRequestParams'
import { IDashboardItem } from '../types/code_service/IDashboardItem'

const CodeServiceApi = axios.create({
  baseURL: getCodeSvcURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export async function fetchSources(
  cakeId: string,
  isEndUserView: boolean = false,
): Promise<TBackendResponse<IDataObjectSet>> {
  const params: IInitializeRequestParams = {cake_id: ''}

  if (cakeId) {
    params.cake_id = cakeId
  }

  // for sales demo
  if (isEndUserView) params.cake_id = cakeId;

  const promise = CodeServiceApi.post('/initialize', params)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IDataObjectSet>>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postToDashboard(cakeId: string, queryId: string) {
  const params = {query_id: queryId, cake_id: cakeId }
  const promise = CodeServiceApi.post('/save-to-dashboard', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: any) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postDeleteDashboardItem(cakeId: string, queryId: string): Promise<TBackendResponse<object>> {
  const params = {query_id: queryId, cake_id: cakeId}
  const promise = CodeServiceApi.post('/delete-dashboard-item', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: any) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postToRunDashboardItem(cakeId: string, queryId: string): Promise<TBackendResponse<object>> {
  const params = {query_id: queryId, cake_id: cakeId}
  const promise = CodeServiceApi.post('/run-dashboard-item', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: any) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function fetchDashboardItems(cake_id: string): Promise<TBackendResponse<IDashboardItem[]>> {
  const params = {cake_id: cake_id}
  const promise = CodeServiceApi.post('/dashboard-items', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IDashboardItem[]>>) => {
        console.log("fetch response", response)
        resolve(response.data)
      })
      .catch((e) => {
        console.log("fetch error", e as Error)
        reject(e)
      })
  })
}

export async function fetchAnswer(
  q: string,
  chatHistory: string[],
  sseChannel: string,
  sessionId: string | null,
  cakeId: string = '',
  signal: AbortSignal,
): Promise<TQueryBackendResponse<IAnswerResponse>> {
  const params: IQueryRequestParams = {
    q: q,
    chat_history: chatHistory,
    sse_channel: sseChannel,
    session_id: sessionId,
    cake_id: cakeId,
  }

  const promise = CodeServiceApi.post('/query', params, { signal })

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TQueryBackendResponse<IAnswerResponse>>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function flagAnswer(
  queryId: string,
  isPositive: boolean,
  feedback?: string,
  cakeId?: string,
  q?: string
): Promise<TBackendResponse<IFlagAnswerResponse>> {
  const responsePromise = CodeServiceApi.post('/flag', {
    query_id: queryId,
    rating: Number(isPositive),
    comments: feedback,
    cake_id: cakeId,
    q: q
  })

  return new Promise((resolve, reject) => {
    responsePromise
      .then((response: AxiosResponse<TBackendResponse<IFlagAnswerResponse>>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

