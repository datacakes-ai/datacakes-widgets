export type TBackendResponse<T> = {
  data: T
  status: 'ok' | 'error'
  message?: string
}

export type TQueryBackendResponse<T> = TBackendResponse<T> & {
  query_id: string,
  original_query_id?: string,
  cached?: boolean
}
