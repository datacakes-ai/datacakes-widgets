export interface ITable {
  id: string
  name: string
  description: string
  source: string
  columns: ITableColumn[]
  data_src?: object
  fields?: []
}
