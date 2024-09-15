import { getCodeSvcURL } from '../utils/main'

export const startSSE = (
  sseChannel: string,
  onMessageReceived: (this: EventSource, ev: MessageEvent<any>) => any,
): EventSource => {
  const sseSource = new EventSource(getCodeSvcURL() + '/subscribe/' + sseChannel)
  /* Need to bind "handleSSE" to the _widget_ ("this"), else
   * the "this" within handleSSE will refer to the EventSource object
   * (which has no access to, say, thoughtsText).
   * Source: https://trekinbami.medium.com/its-not-magic-using-bind-in-javascript-18834e95cd8e
   */
  sseSource.addEventListener('message', onMessageReceived)

  return sseSource
}

export const stopSSE = (sseSource: EventSource) => {
  sseSource.close()
}
