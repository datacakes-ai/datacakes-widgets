import axios, { AxiosResponse } from 'axios'
import { getSrcSvcURL } from '../utils/main'
import { TBackendResponse } from '../types/TBackendResponse'
import { IDataObject } from '../types/source_service/IDataObject'
import { ITable } from '../types/source_service/ITable'
import { ITableWithLinks } from '../types/source_service/ITableWithLinks'
import { ISampleQuestions } from '../types/source_service/ISampleQuestions'
import { IDataRecipe } from '../types/source_service/IDataRecipe'
import { IUserPayload } from '../types/source_service/IUserPayload'
import { IDataSource } from '../types/source_service/IDataSource'
// import { Object } from 'lodash'

const SourceServiceApi = axios.create({
  baseURL: getSrcSvcURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// SourceServiceApi.interceptors.request.use((config) => {
//   // Hardcode cake_id for testing.
//   if (DEV && BIGQUERY_TEST_CAKE_ID != null && BIGQUERY_TEST_CAKE_ID.length > 0) {
//     config.params = { ...config.params, cake_id: BIGQUERY_TEST_CAKE_ID }
//   }
//   return config
// })

export async function fetchTables(): Promise<IDataObject[]> {

  // todo: there will be other cases where we need to pass user data to get tables
  const promise = SourceServiceApi.get('/tables');

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IDataObject[]>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

interface IState {
  cake_id: string,
  has_datasrcs: boolean,
  datasrcs: IDataSource[],
  cakes: IDataRecipe[]
}

export async function fetchState(): Promise<IState> {
  const promise = SourceServiceApi.get('/v1.0/state')
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IState>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }
        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postState(payload: {cake_id: string}): Promise<IState> {
  const promise = SourceServiceApi.post('/v1.0/state', payload)
  return new Promise(() => { promise.then().catch() })
}

export async function fetchDataSources(): Promise<IDataSource[]> {

  // todo: there will be other cases where we need to pass user data to get tables
  const promise = SourceServiceApi.get('/v1.0/data-sources');

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IDataSource[]>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postAddMarketDataset(cake_id: string): Promise<boolean> {
  const params = {cake_id: cake_id}
  const promise = SourceServiceApi.post('/v1.0/add-market-dataset', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<object>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(true)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postDeleteDataSource(src_id: string): Promise<object> {
  const params = {datasrc_id: src_id}
  const promise = SourceServiceApi.post('/v1.0/delete-data-source', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<object>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function fetchTableColumnDescriptions(cakeId: string) {
  const promise = SourceServiceApi.get(`/descriptions?cake_id=${cakeId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<[]>>) => {
        resolve(response.data.data || [])
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function postTableColumnDescriptions(cakeId: string, descriptions: object) {
  const params = {cake_id: cakeId, descriptions: descriptions}
  const promise = SourceServiceApi.post('/descriptions', params)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data.data || [])
      })
      .catch((e) => {
        reject(e)
      })
  })
}




export async function fetchTableDetails(
  tables: object[],
  withAiDescriptions: boolean = true,
): Promise<ITable[]> {
  const promise = SourceServiceApi.post('/table-details', {
      tables: tables,
      ai_descriptions: withAiDescriptions
  })

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<ITable[]>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function saveRecipe(recipe: ITableWithLinks[]): Promise<ITableWithLinks[]> {
  // Remove empty (null) column values.
  const newRecipe = recipe.map((table: ITableWithLinks) => {
    return {
      ...table,
      columns: table.columns.filter((x) => x),
    }
  })

  const body = {
    recipe: newRecipe,
    // cake_id: BIGQUERY_TEST_CAKE_ID,
  }

  const promise = SourceServiceApi.post('/recipes', body)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<ITableWithLinks[]>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function fetchRecipe(): Promise<ITableWithLinks[]> {
  const promise = SourceServiceApi.get('/recipes')

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<ITableWithLinks[]>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data || [])
      })
      .catch((e) => {
        reject(e)
      })
  })
}



export async function postPreconfiguredDataset(datasetId: number): Promise<ITableWithLinks[]> {
  const promise = SourceServiceApi.get(`/add-preconfigured?dataset=${datasetId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<ITableWithLinks[]>>) => {
        if (response.data.status !== 'ok') {
          return reject('Request failed')
        }

        resolve(response.data.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const postModel = async (data: FormData): Promise<TBackendResponse<any>> => {
  const promise = SourceServiceApi.post('/upload-model', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const postCSVFiles = async (data: FormData): Promise<TBackendResponse<any>> => {
  console.log('postCSVFiles files:', data);
  console.log('postCSVFiles files to ' + SourceServiceApi.defaults.baseURL + '/upload-csv');
  const promise = SourceServiceApi.post('/upload-csv', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const deleteCSVFiles = async (data: FormData): Promise<TBackendResponse<any>> => {
  console.log('deleteCSVFiles files:', data);
  console.log('deleteCSVFiles files to ' + SourceServiceApi.defaults.baseURL + '/delete-csv');
  const promise = SourceServiceApi.post('/delete-csv', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const addDataObjects = async (data: any): Promise<TBackendResponse<any>> => {
  const promise = SourceServiceApi.post('/v1.0/add-data-sources', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export const fetchCSVFiles = async(): Promise<TBackendResponse<any>> => {
  console.log('fetchCSVFiles');
  console.log('fetchCSVFiles ' + SourceServiceApi.defaults.baseURL + '/v1.0/list-csv');
  const promise = SourceServiceApi.get('/v1.0/list-csv');
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const fetchCustomerIds = async(datasrc_id: string): Promise<TBackendResponse<any>> => {
  console.log('fetchCustomerIds');
  console.log('fetchCustomerIds ' + SourceServiceApi.defaults.baseURL + '/fetch-google-ads-customers');
  const promise = SourceServiceApi.get('/fetch-google-ads-customers?datasrc_id='+datasrc_id)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      })
  })
}

export async function updateGoogleAdsDataSourceWithCustomerId (datasrc_id: string, customer_id: string) {
  const params = {datasrc_id: datasrc_id, customer_id: customer_id}
  const promise = SourceServiceApi.post('/update-google-ads-data-source-with-customer-id', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  })
}

export const fetchAnalyticsProperties = async(datasrc_id: string): Promise<TBackendResponse<any>> => {
  console.log('fetchAnalyticsProperties');
  const promise = SourceServiceApi.get('/fetch-google-analytics-properties?datasrc_id='+datasrc_id)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      })
  })
}

export async function updateDataSourceActive (datasrc_id: string, active: object[]) {
  const params = {datasrc_id: datasrc_id, active: active}
  const promise = SourceServiceApi.post('/update-data-source-active', params)
  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function saveRestrictionsData(
  data: any
): Promise<any> {

  const promise = SourceServiceApi.post('/restrictions', data)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<any>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function getRestrictionsData(
): Promise<any> {

  const promise = SourceServiceApi.get('/restrictions')

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<any>) => {
        resolve(response.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function fetchTitle(cakeId: string | null): Promise<string | null> {
  const promise = SourceServiceApi.get(`/title?cake_id=${cakeId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<string>>) => {
        console.log('/title response', response.data);
        resolve(response?.data?.data)
      })
      .catch((e) => {
        console.log('/title error', e)
        reject(e)
      })
  })
}

export async function fetchProviderInformation(cakeId: string | null): Promise<Record<string, string>> {
  const promise = SourceServiceApi.get(`/provider${cakeId ? `?cake_id=${cakeId}` : ''}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<any>>) => {
        console.log('Provider information response', response.data);
        resolve(response.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function fetchSampleQuestions(cakeId: string | null): Promise<ISampleQuestions> {
  const promise = SourceServiceApi.get(`/load_sample_questions?cake_id=${cakeId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<ISampleQuestions>>) => {
        console.log('Sample questions response', response.data);
        resolve(response?.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export async function fetchAllRecipesByCurrentUser(): Promise<[]> {
  const promise = SourceServiceApi.get(`/get-data-recipes`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<[]>>) => {
        console.log('Server recipe', response.data);
        resolve(response?.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function fetchDataRecipeById(cakeId: string | null): Promise<IDataRecipe> {
  const promise = SourceServiceApi.get(`/get-data-recipe?cake_id=${cakeId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IDataRecipe>>) => {
        resolve(response?.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function deleteDataRecipeById(cakeId: string | null): Promise<IDataRecipe> {
  const promise = SourceServiceApi.get(`/delete-data-recipe?cake_id=${cakeId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IDataRecipe>>) => {
        resolve(response?.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function saveDataRecipe(payload: IDataRecipe): Promise<Record<string, string>> {
  const promise = SourceServiceApi.post(`/save-data-recipe`, payload)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<Record<string, string>>) => {
        resolve(response?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function saveProviderInformation(payload: any): Promise<Record<string, string>> {
  const promise = SourceServiceApi.post(`/provider`, payload)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<Record<string, string>>) => {
        resolve(response?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function uploadProviderLogo(payload: any): Promise<Record<string, string>> {
  const promise = SourceServiceApi.post(`/upload-image`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<Record<string, string>>) => {
        resolve(response?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function fetchAllUsersByCurrentUser(): Promise<[]> {
  const promise = SourceServiceApi.get(`/get-users`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<[]>) => {
        console.log('Server recipe', response.data);
        resolve(response?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function fetchUserById(userId: string | null): Promise<IUserPayload> {
  const promise = SourceServiceApi.get(`/get-user?user_id=${userId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IUserPayload>>) => {
        resolve(response?.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function deleteUserById(userId: string | null): Promise<IUserPayload> {
  const promise = SourceServiceApi.get(`/delete-user?user_id=${userId}`)

  return new Promise((resolve, reject) => {
    promise
      .then((response: AxiosResponse<TBackendResponse<IUserPayload>>) => {
        resolve(response?.data?.data)
      })
      .catch((e) => {
        reject(e)
      })
  });
}

export async function postReportTourClick(payload: object) {
  SourceServiceApi.post('/report-tour-click', payload)
}