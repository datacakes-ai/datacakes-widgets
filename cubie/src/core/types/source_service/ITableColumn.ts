interface ITableColumn {
  name: string
  type: 'TIMESTAMP' | 'STRING' | 'FLOAT' | any
  description: string | null
  is_selected: boolean
}
