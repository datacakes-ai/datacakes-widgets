import { IDataObject } from './IDataObject'

export interface IDataObjectSet {
  core: IDataObject[]
  session_id: string,
  sample_questions: []
}
