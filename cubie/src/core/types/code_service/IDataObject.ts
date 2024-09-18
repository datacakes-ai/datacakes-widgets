export interface IDataObject {
  description: string
  location: string
  source: string
  name: string
  path: string
  schema: string[]
  source_type: string
  sample: IDataSample
  columns?: string[]
  q?: string
  num_rows?: number
}

export interface IDataSample {
  columns: string[]
  data: (string | number)[][]
  index: number[]
}
