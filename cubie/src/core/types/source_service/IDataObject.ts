export interface IDataObject {
  source: string
  project_id: string
  table_full_id: string
  table_id: string
  is_selected: boolean
  data_src: object
  is_addon?: boolean
  addon_id?: string
}
