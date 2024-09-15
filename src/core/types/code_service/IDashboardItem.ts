import { IAnswerResponse } from "./IAnswerResponse";

export interface IDashboardItem {
  query_id: string,
  answer: IAnswerResponse,
  viz: string,
  saved_at: string,
}