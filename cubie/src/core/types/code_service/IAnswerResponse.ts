import { IChartData } from './IChartData'

export interface IAnswerResponse {
  answer: string
  data: any[]
  chart_data: IChartData
  chart_html?: string
  insight?: string | null
  recommendation?: string | null
}
