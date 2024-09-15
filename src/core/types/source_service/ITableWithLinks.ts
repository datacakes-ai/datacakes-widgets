import { ITable } from './ITable'

export interface ITableLink {
  column: string
  target_column: string
  target_table_id: string
}

export interface ITableWithLinks extends ITable {
  links?: ITableLink[]
}
