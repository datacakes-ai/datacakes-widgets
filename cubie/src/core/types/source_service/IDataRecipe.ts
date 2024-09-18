import { ITableWithLinks } from "./ITableWithLinks"

export interface IDataRecipe {
  cake_id: string | null
  name: string
  max_rows: number
  title: string
  recipe?: ITableWithLinks[],
  sample_questions?: any[]
}