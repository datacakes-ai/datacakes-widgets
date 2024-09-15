import { makeAutoObservable } from 'mobx'
import { error, success } from '../core/services/alerts'
import { startSSE, stopSSE } from '../core/services/messages'
import { fetchDashboardItems, fetchAnswer, fetchSources, flagAnswer, postToDashboard, postToRunDashboardItem, postDeleteDashboardItem } from '../core/services/code_service'
import { IChartData } from '../core/types/code_service/IChartData'
import { IDataObject } from '../core/types/code_service/IDataObject'
import { getCakeIdFromUrl, randomString } from '../core/utils/main'
import { postModel } from '../core/services/source_service'
import { IDashboardItem } from '../core/types/code_service/IDashboardItem'
import { LOGIN_URL } from '../core/config/main'
import { IDataRecipe } from '../core/types/source_service/IDataRecipe'

export class AppStore {


  // ### Cubie State ##################################################################################
  public cakeId: string
  public title: string = ''
  public coreDataObjects: IDataObject[] = []
  public sampleQuestionVisible: boolean = true
  private eventSource: EventSource | null = null
  public sessionId: string | null = null
  public isInitializing: boolean = false

  public setCoreDataObjects(sources: IDataObject[]) {
    this.coreDataObjects = sources
  }
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
  public setSampleQuestionVisible(visible: boolean) {
    this.sampleQuestionVisible = visible
    this.prepareForQuestion(false)
  }
  public async updateSources(isEndUserView?: boolean) {
    if (!this.cakeId) {
      console.log("No cakeId, so no call to /initialize")
      return
    }
    if (this.isInitializing) {
      console.log("isInitializing true, so no new call to /initialize")
      return
    }
    try {
      this.setCoreDataObjects([])

      this.setIsInitializing(true)
      const response = await fetchSources(this.cakeId, isEndUserView)
      const sessionId = response.data.session_id

      if (sessionId === null) {
        error('session_id not initialized, please try loading the page again')
        return;
      }

      this.setSessionId(sessionId)

      const originalSources = response.data.core || []
      if (originalSources.length === 0) {
        error('tables didn’t load, please wait a few minutes and try again.')
        return;
      }
      this.setCoreDataObjects(originalSources)
    } catch (e: any) {
      if (e.response.status === 401 || e.response.status === 403) {
        
        this.setShowLoginModal(true)
        // return
      } else {
        this.handleError(e)
      }
    } finally {
      this.setIsInitializing(false)
    }
  }
  
  public resetCubie() {
    this.setCoreDataObjects([])
    this.setCakeId('')
    this.setTitle('')
    this.sessionId = null
    this.question = ''
    this.setInput('')
    this.thoughtsText = ''
    this.answerText = ''
    this.answerData = []
    this.answerChartData = {}
    this.answerChartHtml = null
    this.dashboardItems = []
    this.queryId = null
    this.isCached = false
    this.originalQueryId = null
    this.chatHistory = []
    console.log("Cubie reset")
  }

  public activateCake(cake: IDataRecipe) {
    this.resetCubie()
    this.setCakeId(cake.cake_id || '')
    this.updateSources()
    this.title = cake.title || ''
    this.loadDashboardItems(this.cakeId)
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
  public answerData: any[] = []
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
    this.setSampleQuestionVisible(false)
    this.prepareForQuestion(true)

    const sseChannel = randomString()

    this.eventSource = startSSE(sseChannel, this.handleSSE.bind(this))

    let response = null

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
        console.log("AppStore.tsx line 191" + JSON.stringify(this.answerChartHtml))
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
    this.setSampleQuestionVisible(true)
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
    this.answerData = []
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

  public toggleActionLogOpenedInNewWindow() {
    this.isActionLogOpenedInNewWindow = !this.isActionLogOpenedInNewWindow
  }
  public openActionLogOpenedInNewWindow() {
    this.isActionLogOpenedInNewWindow = true
  }
  public closeActionLogOpenedInNewWindow() {
    this.isActionLogOpenedInNewWindow = false
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

    let response = null
    try {
      const qid = (this.isCached ? this.originalQueryId : this.queryId) || ''
      response = await flagAnswer(qid, isPositive, feedback, this.cakeId, this.question)
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
  
  // ### Dashboard State ##################################################################################
  public isDashboardLoading = false
  public setIsDashboardLoading(value: boolean) {
    this.isDashboardLoading = value
  }
  
  public dashboardItems: IDashboardItem[] = []
  public setDashboardItems(value: IDashboardItem[]) {
    this.dashboardItems = value
  }

  public tempDashboardItems: IDashboardItem[] = []
  public addToTempDashboardItems(value: IDashboardItem) {
    this.tempDashboardItems.push(value)
  }

  public async saveToDashboard(cakeId: string, queryId: string, element: HTMLElement) {
    element.innerText = "Saving..."
    const qid = ((queryId == this.queryId && this.isCached) ? this.originalQueryId : queryId) || queryId
    const result = await postToDashboard(cakeId, qid)
    if (result) {
      console.log(result)
      element.innerText = "Saved"
      setTimeout(()=>{
        this.loadDashboardItems(this.cakeId)
      }, 300)
      
    } else {
      console.log("Save to Dashboard failed", result)
    }
  }

  public async runAllDashboardItems(cakeId: string, element: HTMLElement) {
    let awaitingNum = this.dashboardItems.length
    this.dashboardItems.map(async (d: IDashboardItem) => {
      console.log("rerunning item...")
      const r = await postToRunDashboardItem(cakeId, d.query_id)
      console.log(r)
      console.log('done', element)
      awaitingNum -= 1
      if (awaitingNum <= 0)
        await this.loadDashboardItems(cakeId)
    })
  }

  public async runDashboardItem(cakeId: string, queryId: string, element: HTMLElement) {
    element.innerText = "Running..."
    const onclick_func = element.onclick
    element.onclick = null
    const result = await postToRunDashboardItem(cakeId, queryId)
    if (result.status == 'ok') {
      element.innerText = "Done"
      setTimeout(()=>{
        element.innerText = "Re-run analysis"
      }, 3000)
    } else {
      element.onclick = onclick_func
      element.innerText = "Run failed... Retry?"
    }
  }

  public async deleteDashboardItem(cakeId: string, queryId: string) {
    const result = await postDeleteDashboardItem(cakeId, queryId)
    if (result.status='ok')
      return true
  }

  public async loadDashboardItems(cakeId: string) {
    let response = null
    try {
      console.log('Loading dashboard items')
      this.setIsDashboardLoading(true)
      response = await fetchDashboardItems(cakeId)
      this.setIsDashboardLoading(false)
    } catch (e: any) {
      console.log(e)
      this.handleError(e)
      this.setIsDashboardLoading(false)
      return
    }
    console.log("loadDashboardItems response", response)
    if (response.status == 'ok') {
      console.log(response.data)
      this.setDashboardItems(response.data)
      console.log(this.dashboardItems)
    } else {
      console.log(response.message)
    }
  }

  // ### Constructor ##################################################################################

  constructor() {
    makeAutoObservable(this)

    this.cakeId = getCakeIdFromUrl()
  }

  // ### Other ##################################################################################

  public error: string = ''
  public showLoginModal = false
  // public isWelcomeModalOpen = true

  // @todo: Rework it: move the modal state to AppStore instead.
  // public modalCloseHandler: Function | null = null

  // // isWelcomeModal initiated for CreateDataCake event
  // public isWelcomeTriggedForCreateDataCake: boolean = false;


  public removeOpenModalParam() {
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  public setShowLoginModal(show: boolean) {
    this.showLoginModal = show
  }

  // // @todo: Rework it: move the modal state to AppStore instead.
  // public setModalCloseHandler(modalCloseHandler: Function) {
  //   this.modalCloseHandler = modalCloseHandler
  // }
  // public callModalCloseHandler() {
  //   if (this.modalCloseHandler == null) {
  //     return
  //   }
  //   this.modalCloseHandler()
  // }

  public async uploadModel(data: FormData) {
    try {
      await postModel(data)
      return true
    } catch (e: any) {
      this.handleError(e)
      return false
    }
  }

  protected handleError(e: any | null) {
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

  protected handleSuccess(message: string) {
    success(message)
  }
}
