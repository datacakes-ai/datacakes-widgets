export interface IQueryRequestParams {
  q: string
  chat_history?: string[]
  sse_channel: string
  session_id: string | null
  cake_id?: string
  isWidget?: boolean
}
