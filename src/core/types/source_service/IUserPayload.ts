import { ITableWithLinks } from "./ITableWithLinks"

export interface IUserPayload {
  user_id: string | null
  name: string,
  email: string,
  recipes: ITableWithLinks[],
  expirationDate: any,
  max_queries: number,
  queries_made?: number,
}