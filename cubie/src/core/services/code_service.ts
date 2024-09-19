import axios, { AxiosResponse } from 'axios'
import { TBackendResponse, TQueryBackendResponse } from '../types/TBackendResponse'
import { IAnswerResponse } from '../types/code_service/IAnswerResponse'
import { IFlagAnswerResponse } from '../types/code_service/IFlagAnswerResponse'
import { IInitializeRequestParams } from '../types/code_service/IInitializeRequestParams'
import { IQueryRequestParams } from '../types/code_service/IQueryRequestParams'
import { DATACAKES_CODE_SERVICE_URL } from '../config/main'

const CodeServiceApi = axios.create({
  baseURL: DATACAKES_CODE_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export async function fetchSources(
  cakeId: string,
  isEndUserView: boolean = false,
): Promise<TBackendResponse<any>> {
  const params: IInitializeRequestParams = {cake_id: ''}

  if (cakeId) {
    params.cake_id = cakeId
  }

  // for sales demo
  if (isEndUserView) params.cake_id = cakeId;

  const promise = CodeServiceApi.post('/initialize', params)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data)
      })
      .catch((e) => {
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
    isWidget: true
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

