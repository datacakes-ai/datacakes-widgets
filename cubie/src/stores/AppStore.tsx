import { makeAutoObservable } from 'mobx'
import { error, success } from '../core/services/alerts'
import { startSSE, stopSSE } from '../core/services/messages'
import { fetchSources, fetchAnswer, flagAnswer } from '../core/services/code_service'
import { IChartData } from '../core/types/code_service/IChartData'
import { randomString } from '../core/utils/main'
import { ITable } from '../modules/Answermodule/components/AnswerTable'
export class AppStore {

  // ### Cubie State ##################################################################################
  public cakeId: string
  public title: string = ''
  public sampleQuestionVisible: boolean = true
  private eventSource: EventSource | null = null
  public sessionId: string | null = null
  public isInitializing: boolean = false

  protected setSessionId(sessionId: string) {
    this.sessionId = sessionId
  }
  public setIsInitializing(value:boolean) {
    this.isInitializing = value
  }
  public setCakeId(cakeId: string) {
    this.cakeId = cakeId
  }
  public setInput(value: string) {
    this.input = value
  }
  public setTitle(title: string) {
    this.title = title
  }

  public async updateSources() {
    if (!this.cakeId) {
      console.log("No cakeId, so no call to /initialize")
      return
    }
    if (this.isInitializing) {
      console.log("isInitializing true, so no new call to /initialize")
      return
    }
    try {
      console.log("Initializing...")
      this.setIsInitializing(true)
      const response = await fetchSources(this.cakeId)
      const sessionId = response.data.session_id
      console.log("sessionId", sessionId)
      if (sessionId === null) {
        error('session_id not initialized, please try loading the page again')
        return;
      }

      this.setSessionId(sessionId)
      console.log("Done initializing... session ID = ", sessionId)
    } catch (e: any) {
        this.handleError(e)
    } finally {7
      this.setIsInitializing(false)
    }
  }
  
  public resetCubie() {
    this.setCakeId('')
    this.setTitle('')
    this.sessionId = null
    this.question = ''
    this.setInput('')
    this.thoughtsText = ''
    this.answerText = ''
    this.answerData = {}
    this.answerChartData = {}
    this.answerChartHtml = null
    this.queryId = null
    this.isCached = false
    this.originalQueryId = null
    this.chatHistory = []
    console.log("Cubie reset")
  }

  // ### Question State ##################################################################################
  public queryId: string | null = null
  public originalQueryId: string | null = null
  public isCached: boolean = false
  public question: string = ''
  public input: string = ''
  public isThinking: boolean = false
  public thoughtsText: string = ''
  public _thoughtSource: string | null = null
  public answerText: string = ''
  public answerData: ITable
  public answerChartData: IChartData = {}
  public answerChartHtml: string | null = null
  public answerInsight: string | null = null
  public answerRecommendation: string|null = null
  public cancelRequest: AbortController | null = null
  private _chatHistory: string[] = []
  public _collapsed: boolean = true

  public isActionLogOpenedInNewWindow: boolean = false

  public isNegativeFeedbackLeft: boolean = false
  public isPositiveFeedbackLeft: boolean = false

  set chatHistory(qa: string[]) {
    const maxLength = 10
    this._chatHistory = this._chatHistory.concat(qa)
    this._chatHistory.splice(0, this._chatHistory.length - maxLength)
  }
  get chatHistory(): string[] {
    return this._chatHistory
  }
  public async obtainAnswer() {
    this.prepareForQuestion(true)

    const sseChannel = randomString()

    this.eventSource = startSSE(sseChannel, this.handleSSE.bind(this))

    let response: any = null

    this.cancelRequest = new AbortController()

    try {
      response = await fetchAnswer(
        this.input,
        this.chatHistory,
        sseChannel,
        this.sessionId,
        this.cakeId,
        this.cancelRequest.signal,
      )
    } catch (e: any) {
      this.isThinking = false
      this._collapsed = false

      stopSSE(this.eventSource)

      this.handleError(e)
      return
    }

    stopSSE(this.eventSource)
    this.eventSource = null

    this.isThinking = false
    this._collapsed = false

    console.log(response.data)
    if (response.status == 'ok') {
      this.answerText = response.data.answer ?? ''
      this.answerInsight = response.data.insight ?? ''
      this.answerRecommendation = response.data.recommendation ?? ''
      this.answerData = response.data.data ?? []
      this.queryId = response.query_id
      this.originalQueryId = response.original_query_id || response.query_id
      this.isCached = response.cached || false
      this.answerChartData = response.data.chart_data ?? {}
      if (response.data.chart_html) {
        this.answerChartHtml = response.data.chart_html
      }

      this.error = ''
      this.chatHistory = [this.question, this.answerText]
      this.cancelRequest = null
    } else if (response.status == 'error') {
      this.input = ''
      this.question = ''
      this.answerText = ''
      this.queryId = null
      this.originalQueryId = null
      this.isCached = false
      this.cancelRequest = null
      this.error = "I'm overwhelmed! Try reloading...."
      console.log("AppStore.tsx line 204 response.status == error")
    }
  }

  public cancelRequestAction() {
    if (!this.cancelRequest) return
    stopSSE(this.eventSource as EventSource)

    this.cancelRequest.abort()
    this.cancelRequest = null
    this.eventSource = null
    this._collapsed = false
    this.prepareForQuestion(false)
  }

  protected handleSSE(event: MessageEvent) {
    const thought = JSON.parse(event['data'])
    
    switch (thought['source']) {
      case 'llm':
        thought['text'] = thought['text'].replace('\n', '<br />')
        break
      case 'llm-code':
        break
      case 'python':
        thought['text'] = thought['text'].replace('\n', '<br />')
        break
      case 'python-code':
        break
    }
    
    this.thoughtsText += thought['text']
    this.thoughtsText = this.thoughtsText.replace("<br /><br /><br />", "<br /><br />")
    this.thoughtsText = this.thoughtsText.replace("<br /><code><br />", "<code><br />")
  }

  public resetQuestion() {
    this.prepareForQuestion(false)
  }
  
  public prepareForQuestion(isThinking: boolean) {
    this.question = this.input
    this.thoughtsText = ''
    this._thoughtSource = null
    this.answerText = ''
    this.answerData = {}
    this.answerChartData = {}
    this.answerChartHtml = null
    this.error = ''
    this.isThinking = isThinking
    this.queryId = null
    this.originalQueryId = null
    this.isCached = false
    this.isNegativeFeedbackLeft = false
    this.isPositiveFeedbackLeft = false
  }

  public async flagAnswer(isPositive: boolean, feedback?: string) {
    if (this.queryId == null) {
      console.error('QueryId is not set. Cannot flag the answer.')
      return
    }

    // Deselect previously used feedback button.
    if (isPositive) {
      this.setIsNegativeFeedbackLeft(false)
    } else {
      this.setIsPositiveFeedbackLeft(false)
    }

    try {
      const qid = (this.isCached ? this.originalQueryId : this.queryId) || ''
      const response = await flagAnswer(qid, isPositive, feedback, this.cakeId, this.question)
      if (response.status !== 'ok') {
        this.handleError('Cannot flag the answer with queryId:' + qid)
        return
      }

      this.handleSuccess('Your feedback has been recorded. Thank you!')

      // Select the button which has been used.
      if (isPositive) {
        this.setIsPositiveFeedbackLeft(true)
      } else {
        this.setIsNegativeFeedbackLeft(true)
      }
    } catch (e) {
      this.handleError(e)
      return
    }
  }

  public setIsNegativeFeedbackLeft(value: boolean) {
    this.isNegativeFeedbackLeft = value
  }
  public setIsPositiveFeedbackLeft(value: boolean) {
    this.isPositiveFeedbackLeft = value
  }
  
  // ### Constructor ##################################################################################

  constructor() {
    makeAutoObservable(this)
  }

  // ### Other ##################################################################################

  public error: string = ''
  
  protected handleError(e: any | null) {
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

  protected handleSuccess(message: string) {
    success(message)
  }
}
