import { ITableLinkColumnLocal } from './ITableLinkColumnLocal'

export interface ITableLinkLocal {
  _id: string
  column1: ITableLinkColumnLocal | null
  column2: ITableLinkColumnLocal | null
}
