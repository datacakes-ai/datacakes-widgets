import { makeAutoObservable } from 'mobx'
import { MAX_TABLES_SETUP } from '../core/config/table_setup'
import { error, success, warning } from '../core/services/alerts'
import {
  fetchTableDetails,
  fetchTables,
  fetchDataSources,
  saveRecipe,
  fetchProviderInformation,
  fetchDataRecipeById,
  deleteDataRecipeById,
  fetchAllRecipesByCurrentUser,
  saveDataRecipe,
  saveProviderInformation,
  uploadProviderLogo,
  fetchAllUsersByCurrentUser,
  fetchUserById,
  fetchSampleQuestions,
  postDeleteDataSource,
  postAddMarketDataset,
  postReportTourClick,
  postState,
  fetchState,
  fetchTitle,
  postTableColumnDescriptions,
  fetchTableColumnDescriptions,
} from '../core/services/source_service'
import { ISrcsMap } from '../core/types/source_service/ISrcsMap'
import { IDataObject } from '../core/types/source_service/IDataObject'
import { ITable } from '../core/types/source_service/ITable'
import { ITableLinkColumnLocal } from '../core/types/source_service/ITableLinkColumnLocal'
import { ITableWithLinks } from '../core/types/source_service/ITableWithLinks'
import { handleError, isEndUserView } from '../core/utils/main'
import { IDataRecipe } from '../core/types/source_service/IDataRecipe'
import { IUserPayload } from '../core/types/source_service/IUserPayload'
import { ISampleQuestions } from '../core/types/source_service/ISampleQuestions'
import { IDataSource } from '../core/types/source_service/IDataSource'
import { TourType } from '../core/types/source_service/IGuideTour'
import { IMktDatasetInfo } from '../core/types/source_service/IMktDatasetInfo'
import { AppStore } from './AppStore'

export class SettingsStore {
  public appStore: AppStore|null = null
  public setAppStore = (appStore: AppStore) => {
    this.appStore = appStore
  }
  /**
   * List of data sources
   */
  public dataSources: IDataSource[] = []
  
  /**
   * List of data tables with meta-data, loaded on the first step.
   */
  public dataObjects: IDataObject[] = []
  public initialDataObjects: IDataObject[] = []
  public fetchNeededforTableDetails: boolean = true
  public setFetchNeededForTableDetails = (value: boolean) => {
    this.fetchNeededforTableDetails = value
  }
  public fetchNeededforTables: boolean = true
  public setFetchNeededForTables = (value: boolean) => {
    this.fetchNeededforTables = value
  }

  public mktDatasets: IMktDatasetInfo[] = []
  public mktDatasetsDict: Object = {}
  
  public setMktDatasets = (cakes: IMktDatasetInfo[]) => {
    this.mktDatasets = cakes
    let datasetsDict = Object()
    this.mktDatasets.map((cake) => {
      datasetsDict[cake.cakeId] = cake
    })
    this.mktDatasetsDict = datasetsDict
  }
  /**
   * List of table ids which user selected on the first step.
   */
  public selectedTables: string[] = []

  /**
   * Tables with columns loaded from backend on the second step.
   */
  public sourceTables: ITable[] = []

  /**
   * Tables with descriptions predicted through AI.
   */
  public sourceTablesWithAi: ITable[] = []

  /**
   * All user selection and changes for the session.
   */
  public history: ITableWithLinks[] = []

  /**
   * We use it to display a loading indicator when loading data from backend.
   */
  public isLoading: boolean = false
  /**
   * Indicates when we're currently loading AD descriptions. It's a sub-status of the isLoading state.
   */
  public isLoadingAiDescriptions: boolean = false

  /**
   * Stores table names, which descriptions have been guessed by AI.
   */
  public tablesWithGuessedDescriptions: string[] = []
  /**
   * Stores column names, which descriptions have been guessed by AI.
   */
  public columnsWithGuessedDescriptions: Map<string, string[]> = new Map<string, string[]>()

  /**
   * Stores table names, which descriptions have been entered by user.
   */
  public tablesWithEnteredDescriptions: string[] = []
  /**
   * Stores column names, which descriptions have been entered by user.
   */
  public columnsWithEnteredDescriptions: Map<string, string[]> = new Map<string, string[]>()

  /**
   * Stores the current recipe information.
   */
  public selectedDataRecipeRecord: IDataRecipe = {
    cake_id: null,
    name: '',
    max_rows: 0,
    recipe: [],
    sample_questions: [],
    title: ''
  }

  /**
   * Stores all the recipes fetched from server
   */
  public dataRecipes: IDataRecipe[] = []

  /**
   * Selected User profile.
   */
  public selectedUser: IUserPayload = {
    user_id: null,
    name: '',
    email: '',
    recipes: [],
    expirationDate: null,
    max_queries: 0
  }

  /**
   * All Users fetched from server
   */
  public allUsers: { data: IUserPayload, status: string }[] = []

  // public dataBaseType: string = 'bigquery'

  /**
   * Provider Information
   */
  public providerInfo: Record<string, string> = {}
  public isFetchingProviderInfo: boolean = false;

  public isProviderInfoEmpty() {
    return !this.providerInfo || this.providerInfo.tagline?.length == 0
  }

  public cameBackFromLinks: boolean = false
  public setCameBackFromLinks(value: boolean) {
    this.cameBackFromLinks = value
  }

  // Sample questions
  public sampleQuestions: any[] = []

  public isSettingsModalOpen: boolean = false
  public googleAdsCustomers: object[] = []
  public setGoogleAdsCustomers(value: object[]) {
    this.googleAdsCustomers = value
  }
  public googleAnalyticsProperties: object[] | null = null
  // Create DataRecipe modal variables
  public isCreateDataRecipeModalOpen: boolean = false
  public isCreateRecipeTriggeredFromAdmin: boolean = false

  // Show share modal
  public isShareModalOpen: boolean = false





  // ### Tours ##################################################################################

  // Show guided tour modal
  public isGuideTourModalOpen: boolean = false;

  // Guide Tour steps
  public tourSteps: any[] = []
  public setTourSteps(steps: any[]) { this.tourSteps = steps }
  public tourStepIndex: number = 0
  public setTourStepIndex(n: number) { this.tourStepIndex = n }
  public tourRunning: boolean = false
  public setTourRunning(b: boolean) { this.tourRunning = b }
  public tourType: TourType = TourType.NONE
  public setTourType(t: TourType) { this.tourType = t }
  public hasSeenDashboardHowTo: boolean = false
  public setHasSeenDashboardHowTo(b: boolean) { this.hasSeenDashboardHowTo = b }

  public setIsGuideTourModalOpen(value: boolean) {
    this.isGuideTourModalOpen = value;
  }

  public setTourDetails(tour: TourType, steps: any[]) {
    this.tourType = tour;
    setTimeout(() => {
      this.tourSteps = steps;
    }, 500);
    console.log('Tour details are set');
  }

  public startTour(tourType: TourType, steps: any[]) {
    this.tourType = tourType
    this.tourSteps = steps
    this.tourStepIndex = 0
    this.tourRunning = true
  }

  public async reportTourClick(tour: TourType, user_email: string) {
    const payload = {
      tour: tour,
      user_email: user_email
    }
    postReportTourClick(payload)
  }

  public resetTour() {
    this.tourType = TourType.NONE
    this.tourSteps = []
    this.tourStepIndex = 0
    this.tourRunning = false
  }


  // ### Edit Table/Column Descriptions ##################################################################################
  public isDescriptionsModalOpen: boolean = false
  public setIsDescriptionsModalOpen(value: boolean) {
    this.isDescriptionsModalOpen = value
  }
  public tcDescriptions: ITable[] = []
  public resetTCDescriptions = () => {
    this.tcDescriptions = []
  }
  public editTableDescription = (tid: string, value: string) => {
    for (var t of this.tcDescriptions) {
      if (t.id == tid) {
        t.description = value
        return
      }
    }
  }
  public editColumnDescription = (tid: string, cname: string, value: string) => {
    for (var t of this.tcDescriptions) {
      if (t.id == tid) {
        for (var c of t.columns) {
          if (c.name == cname) {
            c.description = value
            return
          }
        }
      }
    }
  }
  public async loadTableColumnDescriptions() {
    try {
      console.log('Fetching Descriptions');
      if (!this.appStore?.cakeId)
        return []
      const descriptions = await fetchTableColumnDescriptions(this.appStore?.cakeId as string);
      console.log('Fetched Descriptions', descriptions);
      this.tcDescriptions = descriptions as ITable[]
    } catch (e) {
      console.log(e)
      handleError(e)
    }  
  }
  public async saveTableColumnDescriptions(descriptions: []) {
    try {
      console.log('Saving descriptions', descriptions);
      const result = await postTableColumnDescriptions(this.appStore?.cakeId as string, descriptions);
      console.log('Save descriptions result', result)
      success("Descriptions saved")
      this.resetTCDescriptions()
      this.setIsDescriptionsModalOpen(false)
      this.appStore?.setCoreDataObjects([])
      this.appStore?.updateSources()

      return result
    } catch (e) {
      handleError(e)
    }  
  }

  // ###  ##################################################################################
  
  public setIsSettingsModalOpen(value: boolean) {
    this.isSettingsModalOpen = value
  }

  public setIsCreateDataRecipeModalOpen(value: boolean, isTriggeredFromAdmin = false) {
    this.isCreateDataRecipeModalOpen = value;
    this.isCreateRecipeTriggeredFromAdmin = isTriggeredFromAdmin
  }

  public setIsShareModalOpen(value: boolean) {
    this.isShareModalOpen = value;
  }


  // ### Data Sources ##################################################################################
  public hasDataSources = false
  public setHasDataSources = (value: boolean) => {
    this.hasDataSources = value
  }
  public isDatacakesModalOpen = false
  public setIsDatacakesModalOpen(value: boolean) {
    this.isDatacakesModalOpen = value
  }
  public isDataSourcesModalOpen = false
  public dataSourceIdBeingManaged: string | null = null
  public dataSourceTypeBeingManaged: string = ''
  public setIsDataSourcesModalOpen(value: boolean) {
    this.isDataSourcesModalOpen = value
  }
  public isDataSourceManagerModalOpen = false
  public setIsDataSourceManagerModalOpen(value: boolean, dataSourceType: string = '') {
    if (value) {
      this.dataSourceTypeBeingManaged = dataSourceType
      this.isDataSourceManagerModalOpen = value
    } else {
      this.isDataSourceManagerModalOpen = value
      this.dataSourceTypeBeingManaged = ''
      // setTimeout(()=>{
      //   this.dataSourceBeingManaged = null
      // }, 500)
    }
  }

  // ### State ##################################################################################
  public awaitingState: boolean = false
  public setAwaitingState(value: boolean) {
    this.awaitingState = value
  }
  public async goFetchState() {
    console.log("fetching state")
    this.setAwaitingState(true)
    const state = await fetchState()
    console.log("Done fetching state", state)
    if (!isEndUserView()) {
      if (state.cake_id) {
        this.appStore?.loadDashboardItems(state.cake_id)
        for (var cake of state.cakes) {
          if (cake.cake_id === state.cake_id) {
            this.appStore?.activateCake(cake)
            break
          }
        }
      }
      this.setDataSources(state.datasrcs)
      this.setHasDataSources(state.datasrcs && state.datasrcs.length > 0)
      this.setDataRecipes(state.cakes)
    }
    this.setAwaitingState(false)
  }

  public async reportState(cake_id: string) {
    console.log("reporting state")
    await postState({cake_id: cake_id})
  }

  constructor(appStore: AppStore) {
    this.setAppStore(appStore)
    makeAutoObservable(this)
    if (!isEndUserView()) {
      this.setAwaitingState(true)
      this.goFetchState()
    } else {
      const cakeId = this.appStore?.cakeId
      if (cakeId) {
        this.setAwaitingState(true)
        this.appStore?.updateSources()
        this.loadTitle(cakeId)
        this.loadSampleQuestions(cakeId)
        this.loadProviderInformation(cakeId)
        this.appStore?.loadDashboardItems(cakeId)
        setTimeout(()=>{
          this.setAwaitingState(false)
        }, 2000)
      }
    }
  }

  public toggleSelectedTable(tableName: string, isSelected: boolean) {
    // if (isSelected) {
    const maxLimitReached =
      this.dataObjects.filter((source) => source.is_selected).length >= MAX_TABLES_SETUP

    if (maxLimitReached && isSelected) {
      warning('You can only select up to ' + MAX_TABLES_SETUP + ' data tables.')
      return false
    }

    // this.selectedTables.push(tableName)
    this.setDataObjects(
      this.dataObjects.map((source) => {
        if (source.table_full_id === tableName) {
          return {
            ...source,
            is_selected: isSelected,
          }
        } else {
          return source
        }
      }),
    )

    return true
  }

  public async loadDataObjects() {
    if (this.isLoading) return // already loading data

    this.setIsLoading(true)
    try {
      this.resetDataObjects()
      //if (!this.dataObjects?.length) {
      console.log('############## fetching tables');
      const dataObjects = await fetchTables()
      this.setDataObjects(dataObjects)
      //}
    } catch (e) {
      handleError(e)
    } finally {
      this.setFetchNeededForTables(false)
    }
    this.setIsLoading(false)
  }

  public async loadDataSources() {
    try {
        console.log('############## fetching data sources')
        const dataSources = await fetchDataSources()
        this.setDataSources(dataSources)
        console.log('############## done setting data sources')
      } catch (e) {
        handleError(e)
      }
  }

  public async loadTableDetails() {
    if (this.isLoadingAiDescriptions || this.isLoading) return // return if already loading the tables

    this.setSourceTables([])

    // Don't clear AI descriptions if user came back from Links page.
    if (!this.cameBackFromLinks) {
      this.setSourceTablesWithAi([])
    }

    try {
      const tablesNeeded = this.dataObjects
        .filter((source) => source.is_selected)

      console.log("tablesNeeded", tablesNeeded)

      let tablesNeededDict = Object()
      tablesNeeded.forEach(x=>{tablesNeededDict[x.table_full_id]=x})

      console.log("tablesNeeded", tablesNeeded)
      console.log("tablesNeededDict", tablesNeededDict)
      // const tableNames = this.dataObjects
      //   .filter((source) => source.is_selected)
      //   .map((source) => source.table_full_id)

      this.setIsLoading(true)

      const tables = await fetchTableDetails(tablesNeeded, false)
      // const tables = await fetchTableDetails(tableNames)

      // TODO: Check if we need to add this condition again in future.
      // if (this.history.length === 0) {
      //   this.setHistory(tables)
      // }

      this.setSourceTables(tables)
      this.setHistory(tables)

      this.setIsLoading(false)

      const tablesStillNeeded = tables
        .filter((t) => t.description === null
            || t.columns.map(c=>c.description).some(d => d === null))
        .map(x=>tablesNeededDict[x.id])
      console.log(tablesStillNeeded)
      // Don't load AI descriptions again if user came back from Links page.
      if (!this.cameBackFromLinks && (tablesStillNeeded.length > 0)) {
        this.loadColumnAiDesription(tablesStillNeeded)
      }
    } catch (e) {
      this.setIsLoading(false)
      handleError(e)
    }
  }

  private loadColumnAiDesription(tablesNeeded: object[]) {
    let loadedTables: ITable[] = []
    this.setIsLoadingAiDescriptions(true)

    const _loadColumnAiDescriptionInParallel = async (table: object) => {
      const _table = await fetchTableDetails([table], true)
      console.log('Fetch table Details from server', _table);
      this.setSourceTablesWithAi([...loadedTables, _table].flat())
      loadedTables.push(..._table)

      console.log('loadedTables', loadedTables.length, tablesNeeded.length);
      // if all table columns descriptions are loaded, stop the loading
      if (loadedTables.length === tablesNeeded.length) {
        this.setIsLoadingAiDescriptions(false)
      }
    }

    // load all column description in parallel
    tablesNeeded.forEach((e) => _loadColumnAiDescriptionInParallel(e))
  }

  public async loadRecipesByCurrentUser() {
    try {
      const fetchedRecipes = await fetchAllRecipesByCurrentUser();
      console.log('Fetched Recipes', fetchedRecipes);
      this.setDataRecipes(fetchedRecipes);
      return fetchedRecipes;
    } catch (e) {
      handleError(e)
    }
  }

  public async loadAllUsers() {
    try {
      const users = await fetchAllUsersByCurrentUser();
      this.setAllUsers(users);
    } catch (e) {
      handleError(e)
    }
  }

  public async loadSelectedDataRecipe(cake_id: string | null) {
    if (this.isLoading) return // already loading data

    this.setIsLoading(true)
    try {
      const dataRecipe = await fetchDataRecipeById(cake_id);

      if (!dataRecipe?.cake_id) {
        error('Data recipe is undefined or missing the cake_id property');
        return;
      }

      this.setSelectedDataRecipe(dataRecipe);

      // Check if dataRecipe is defined and has the property sample_questions
      if (dataRecipe) {
        this.setSelectedDataRecipe(dataRecipe);
        if ('sample_questions' in dataRecipe)
          this.setSampleQuestions(dataRecipe.sample_questions || []);
      } else {
        // Handle the case where dataRecipe is undefined or sample_questions is not a property
        console.error('Data recipe is undefined or missing the sample_questions property');
        // You may want to set some default state or handle this case appropriately
      }
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async loadSelectedUser(user_id: string | null) {
    if (this.isLoading) return // already loading data

    this.setIsLoading(true)
    try {
      const user = await fetchUserById(user_id);

      if (!user?.user_id) {
        error('User is undefined or missing the user_id property');
        return;
      }
      
      this.setSelectedUser(user);
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async deleteSelectedDataRecipeById(cake_id: string | null) {
    if (this.isLoading) return // already loading data

    this.setIsLoading(true)
    try {
      await deleteDataRecipeById(cake_id);
      const emptyObject: IDataRecipe = {
        cake_id: null,
        name: '',
        max_rows: 0,
        recipe: [],
        sample_questions: [],
        title: ''
      }
      this.setSelectedDataRecipe(emptyObject);
      if (cake_id == this.appStore?.cakeId)
        this.appStore?.resetCubie()
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async deleteSelectedUserById(user_id: string | null) {
    if (this.isLoading) return // already loading data

    this.setIsLoading(true)
    try {
      await deleteDataRecipeById(user_id);
      const emptyObject: IUserPayload = {
        user_id: null,
        name: '',
        email: '',
        recipes: [],
        expirationDate: undefined,
        max_queries: 0
      }
      this.setSelectedUser(emptyObject);
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async createRecipe(payload: IDataRecipe, next?: () => void) {
    this.setIsLoading(true)

    try {
      if (payload.recipe?.length === 0) {
        const data = this.prepareRecipeDataForSaving()
        payload.recipe = data;
      }

      console.log("line before saveDataRecipe; timestamp = "+Date.now())
      const result = await saveDataRecipe(payload)
      console.log("line after saveDataRecipe; timestamp = "+Date.now())
      console.log("result", result)
      this.appStore?.resetCubie()
      this.appStore?.setCakeId(result.cake_id)
      this.appStore?.setTitle(payload.name || payload.title)
      success('Data recipe created successfully.')

      if (next) {
        this.setIsLoading(false)
        console.log("line before next(); timestamp = "+Date.now())
        next();
        console.log("line after next(); timestamp = "+Date.now())
      }
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async saveProvider(payload: any, next?: () => void) {
    this.setIsLoading(true)

    try {

      const response = await saveProviderInformation(payload)
      console.log('saveProvider Server Response', response);

      success('Provider information saved successfully.')

      if (next) {
        this.setIsLoading(false)
        next();
      }
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public updateTableDescription(tableId: string, tableDescription: string) {
    this.registerEnteredTable(tableId)

    const selectedTables = this.getSelectedTablesFromHistory()

    const updatedTables = this.cloneTables(selectedTables)

    const tableIndex = updatedTables.findIndex((table: ITableWithLinks) => table.id === tableId)
    if (tableIndex === -1) {
      const oldTable = this.sourceTables.find((table: ITableWithLinks) => table.id === tableId)

      const newTable = {
        ...this.cloneTableWoColumnsAndLinks(oldTable as ITableWithLinks),
        description: tableDescription,
      }

      updatedTables.push(newTable)
    } else {
      updatedTables[tableIndex] = {
        ...updatedTables[tableIndex],
        description: tableDescription,
      }
    }

    this.history = updatedTables
  }

  public updateTableColumnDescription(
    tableId: string,
    columnName: string,
    columnDescription: string,
  ) {
    this.registerEnteredColumn(tableId, columnName)

    const updatedTables = this.cloneTables(this.history)

    const oldTable = this.sourceTables.find((table: ITableWithLinks) => table.id === tableId)
    let oldColumn = null
    if (oldTable != null) {
      oldColumn = oldTable.columns.find((column: ITableColumn) => column.name === columnName)
    }

    const tableIndex = updatedTables.findIndex((table: ITableWithLinks) => table.id === tableId)
    if (tableIndex === -1) {
      // It can never be null here but I need to shut up the linter.
      if (oldTable != null) {
        const newTable = this.cloneTableWoColumnsAndLinks(oldTable)

        // It can never be null here but I need to shut up the linter.
        if (oldColumn != null) {
          newTable.columns.push({ ...oldColumn, description: columnDescription })
        }

        updatedTables.push(newTable)
      }
    } else {
      const columnIndex = updatedTables[tableIndex].columns.findIndex(
        (column: ITableColumn) => column.name === columnName,
      )

      if (columnIndex === -1) {
        if (oldColumn !== null) {
          updatedTables[tableIndex].columns.push({
            ...oldColumn,
            description: columnDescription,
          } as ITableColumn)
        }
      } else {
        updatedTables[tableIndex].columns[columnIndex] = {
          ...updatedTables[tableIndex].columns[columnIndex],
          description: columnDescription,
        } as ITableColumn
      }
    }

    this.history = updatedTables
  }

  public toggleTableColumn(tableId: string, columnName: string) {
    let updatedTables = this.cloneTables(this.history) // Clone history as it stores the changes made in previous attempt

    updatedTables = updatedTables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          columns: table.columns.map((column) => {
            if (column.name === columnName) {
              return {
                ...column,
                is_selected: !column.is_selected,
              }
            } else {
              return column;
            }
          }),
        }
      } else {
        return table
      }
    })

    this.setSourceTables(updatedTables)

    this.history = updatedTables
  }

  public toggleAllTableColumn(tableId: string) {
    let updatedTables = this.cloneTables(this.history) // Clone history as it stores the changes made in previous attempt

    updatedTables = updatedTables.map((table) => {
      if (table.id === tableId) {
        // check if there is already a column selected.
        // if there is one then select all the columns by settings is_selected to true
        const selectedColumns = table.columns.filter((column) => column.is_selected).length;
        
        return {
          ...table,
          columns: table.columns.map((column) => {
            return {
              ...column,
              is_selected: selectedColumns === table.columns.length ? !column.is_selected : true,
            }
          }),
        }
      } else {
        return table
      }
    })

    this.setSourceTables(updatedTables)

    this.history = updatedTables
  }

  public isTableColumnEnabled(tableId: string, columnName: string) {
    const table = this.sourceTables.find((table: ITable) => table.id === tableId)
    if (table == null) {
      return false
    }

    return (
      table.columns &&
      table.columns.length > 0 &&
      table.columns.find((x) => x.name === columnName)?.is_selected
    )
  }

  public areAllTableColumnChecked(tableId: string) {
    return this.areAllTableColmnsSelected(this.history, tableId)
  }

  public getTableDescriptionFromLocalHistory(tableId: string) {
    return this.getTableDescriptionFromTables(this.history, tableId)
  }

  public getTableColumnDescriptionFromLocalHistory(tableId: string, columnName: string) {
    return this.getTableColumnDescriptionFromTables(this.history, tableId, columnName)
  }

  public getTableDescriptionFromAi(tableId: string) {
    this.registerGuessedTable(tableId)

    return this.getTableDescriptionFromTables(this.sourceTablesWithAi, tableId)
  }

  public getTableColumnDescriptionFromAi(tableId: string, columnName: string) {
    this.registerGuessedColumn(tableId, columnName)

    return this.getTableColumnDescriptionFromTables(this.sourceTablesWithAi, tableId, columnName)
  }

  public updateTableLinks(localLinks: (ITableLinkColumnLocal | null)[][]) {
    let updatedTables = this.cloneTables(this.history)

    updatedTables = updatedTables.map((table: ITableWithLinks) =>
      this.dataObjects
        .filter((source) => source.is_selected)
        .map((source) => source.table_full_id)
        .includes(table.id)
        ? this.cloneTableWoLinks(table)
        : table,
    )

    // Set new links.
    for (let i = 0; i < localLinks.length; i++) {
      // Don't store incomplete table links.
      if (localLinks[i][0] == null || localLinks[i][1] == null) {
        continue
      }

      const index = updatedTables.findIndex(
        (table: ITableWithLinks) => table.id === localLinks[i][0]?.table_id,
      )

      if (updatedTables[index].links == null) {
        updatedTables[index].links = []
      }

      updatedTables[index].links?.push({
        column: localLinks[i][0]?.column_name || '',
        target_column: localLinks[i][1]?.column_name || '',
        target_table_id: localLinks[i][1]?.table_id || '',
      })
    }

    this.history = updatedTables
  }

  public async saveRecipe(next?: () => void) {
    this.setIsLoading(true)

    try {
      const data = this.prepareRecipeDataForSaving()

      await saveRecipe(data)

      this.setHistory([])
      success('Your settings have been saved successfully.')
      if (next) {
        next()
      }
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async saveLogo(payload: any) {
    this.setIsLoading(true)

    try {
      const response = await uploadProviderLogo(payload)
      console.log('Response to return', response);
      return response;
    } catch (e) {
      handleError(e)
    } finally {
      this.setIsLoading(false)
    }
  }

  public async deleteDataSource(src_id: string) {
    try {
      const response = await postDeleteDataSource(src_id)
      console.log('Deleted datasrc', response)
      this.loadDataSources()
    } catch (e) {
      handleError(e)
    }
  }
  
  public async addMarketDataset(cakeId: string) {
    try {
      console.log('Adding market dataset cakeId='+cakeId)
      await postAddMarketDataset(cakeId)
      console.log('Added market dataset cakeId='+cakeId)
    } catch(e) {
      handleError(e)
    }
  }
  /**
   * 
   * @returns null
   */
  public async loadProviderInformation(cakeID: string | null) {
    console.log('Loading provider information');
    this.setIsLoading(true)
    try {
      const provider = await fetchProviderInformation(cakeID)
      this.setProviderInformation(provider)

      return provider;
    } catch (e) {
      // handleError(e)
      console.log('Error in loading provider information', e);
    } finally {
      this.setIsLoading(false)
      // this.isFetchingProviderInfo = false;
    }
  }

  public getSelectedTablesFromHistory() {
    return this.history.filter((table: ITableWithLinks) =>
      this.dataObjects
        .filter((source) => source.is_selected)
        .map((source) => source.table_full_id)
        .includes(table.id),
    )
  }

  public hasSelectedTables() {
    return this.dataObjects.filter((source) => source.is_selected).length > 0
  }

  public hasSelectedColumns() {
    return this.sourceTables
      .map((source) => source.columns.some((column) => column.is_selected))
      .some((i) => i)
  }
  public hasSelectedColumnsInMultipleTables() {
    const selectedTablesFromHistory = this.getSelectedTablesFromHistory()
    let countTablesWithColumns = 0
    selectedTablesFromHistory.forEach((table: ITableWithLinks) => {
      if (table.columns.length > 0) {
        countTablesWithColumns++
      }
    })

    return countTablesWithColumns > 1
  }

  public getTableDescriptionFromTables(tables: ITableWithLinks[], tableId: string) {
    const table = tables.find((table: ITableWithLinks) => table.id === tableId)
    if (table === undefined) {
      return null
    }
    return table.description
  }

  public areAllTableColmnsSelected = (tables: ITableWithLinks[], tableId: string) => {
    const table = tables.find((table: ITableWithLinks) => table.id === tableId)
    if (table === undefined) {
      return false
    }
    return table.columns.every((column) => column.is_selected)
  }

  public getTableColumnDescriptionFromTables(
    tables: ITableWithLinks[],
    tableId: string,
    columnName: string,
  ) {
    const table = tables.find((table: ITableWithLinks) => table.id === tableId)
    if (table === undefined) {
      return null
    }

    const column = table?.columns
      .filter((x) => x)
      .find((column: ITableColumn) => column.name === columnName)
    if (column === undefined) {
      return null
    }

    return column.description
  }

  public isTableDescriptionGuessed(tableId: string) {
    return this.isTableDescriptionAltered(tableId, this.tablesWithGuessedDescriptions)
  }
  public isTableColumnDescriptionGuessed(tableId: string, columnName: string) {
    return this.isTableColumnDescriptionAltered(
      tableId,
      columnName,
      this.columnsWithGuessedDescriptions,
    )
  }

  public isTableDescriptionEntered(tableId: string) {
    return this.isTableDescriptionAltered(tableId, this.tablesWithEnteredDescriptions)
  }
  public isTableColumnDescriptionEntered(tableId: string, columnName: string) {
    return this.isTableColumnDescriptionAltered(
      tableId,
      columnName,
      this.columnsWithEnteredDescriptions,
    )
  }

  private checkTableForExistence(tableId: string) {
    return this.sourceTables.some((table: ITable) => {
      return table.id === tableId
    })
  }
  private checkColumnForExistence(tableId: string, columnName: string) {
    return this.sourceTables.some((table: ITable) => {
      if (table.id !== tableId) {
        return false
      }

      return table?.columns.some((column: ITableColumn) => column.name === columnName)
    })
  }

  /**
   * Prepare recipe for saving based on the local history and ai guesses.
   *
   * @returns {ITableWithLinks[]}
   */
  private prepareRecipeDataForSaving(): ITableWithLinks[] {
    const selectedTablesFromHistory = this.getSelectedTablesFromHistory()

    let recipe: any[] = this.cloneTables(selectedTablesFromHistory)

    recipe = recipe
      .map((table: ITableWithLinks) => {
        // Make sure the table exists in the database (user could delete it).
        if (!this.checkTableForExistence(table.id)) {
          return null
        }

        const tableDescription =
          table.description === null ? this.getTableDescriptionFromAi(table.id) : table.description

        const columns = table.columns || []

        // Don't add empty table to the resulting recipe.
        if (columns.length === 0) {
          return null
        }

        const newColumns = columns
          .map((column: ITableColumn) => {
            // Make sure the column exists in the database (user could delete it).
            if (!this.checkColumnForExistence(table.id, column.name)) {
              return null
            }

            const columnDescription =
              column.description === null
                ? this.getTableColumnDescriptionFromAi(table.id, column.name)
                : column.description

            return {
              ...column,
              description: columnDescription,
            }
          })
          // Filter out null values.
          .filter((x) => x)

        return {
          ...table,
          description: tableDescription,
          columns: newColumns,
        } as ITableWithLinks
      })
      // Filter out null values.
      .filter((x: ITableWithLinks | null) => x)

    return recipe
  }

  private isTableDescriptionAltered(tableId: string, tableList: string[]) {
    return tableList.includes(tableId)
  }

  private isTableColumnDescriptionAltered(
    tableId: string,
    columnName: string,
    tableColumnList: Map<string, string[]>,
  ) {
    const columns = tableColumnList.get(tableId) || []
    return columns.includes(columnName)
  }

  /**
   * Register table as guessed with AI.
   * @param tableId
   */
  private registerGuessedTable(tableId: string) {
    this.tablesWithGuessedDescriptions = this.registerAlteredTable(
      tableId,
      this.tablesWithGuessedDescriptions,
    )
  }

  /**
   * Register table as guessed with AI.
   * @param tableId
   */
  private registerEnteredTable(tableId: string) {
    this.tablesWithEnteredDescriptions = this.registerAlteredTable(
      tableId,
      this.tablesWithEnteredDescriptions,
    )
  }

  /**
   * Register altered table.
   * @param tableId
   */
  private registerAlteredTable(tableId: string, tableList: string[]) {
    if (tableList.includes(tableId)) {
      return tableList
    }
    return tableList.concat(tableId)
  }

  /**
   * Register table column as guessed with AI.
   * @param tableId
   * @param columnName
   */
  private registerGuessedColumn(tableId: string, columnName: string) {
    this.columnsWithGuessedDescriptions = this.registerAlteredColumn(
      tableId,
      columnName,
      this.columnsWithGuessedDescriptions,
    )
  }

  /**
   * Register table column as entered by user.
   * @param tableId
   * @param columnName
   */
  private registerEnteredColumn(tableId: string, columnName: string) {
    this.columnsWithEnteredDescriptions = this.registerAlteredColumn(
      tableId,
      columnName,
      this.columnsWithEnteredDescriptions,
    )
  }

  /**
   * Register altered table column.
   * @param tableId
   * @param columnName
   */
  private registerAlteredColumn(
    tableId: string,
    columnName: string,
    tableColumnList: Map<string, string[]>,
  ) {
    const columns = tableColumnList.get(tableId) || []

    if (columns.includes(columnName)) {
      return tableColumnList
    }

    columns.push(columnName)
    tableColumnList.set(tableId, columns)

    return tableColumnList
  }

  private cloneTableWoColumnsAndLinks(tableWithLinks: ITableWithLinks): ITable {
    return {
      id: tableWithLinks.id,
      name: tableWithLinks.name,
      description: tableWithLinks.description,
      source: tableWithLinks.source,
      columns: [],
      data_src: tableWithLinks.data_src
    }
  }

  private cloneTableWoLinks(tableWithLinks: ITableWithLinks): ITable {
    const table = this.cloneTableWoColumnsAndLinks(tableWithLinks)

    return {
      ...table,
      columns: tableWithLinks.columns,
    } as ITable
  }

  public async loadSampleQuestions(cake_id: string | null) {
    try {
      console.log('Load sample questions');

      const response: ISampleQuestions = await fetchSampleQuestions(cake_id)
      
      // // if there are sample questions in the response
      if (response?.sample_questions.length > 0) {
        this.setSampleQuestions(response?.sample_questions);
      }

    } catch (e: any) {
      error(e);
    } 
  }

  public async loadTitle(cake_id: string | null) {
    try {
      console.log('Load Title');

      const title: string | null = await fetchTitle(cake_id)
      
      // // if there are sample questions in the response
      if (title)
        this.appStore?.setTitle(title)
    } catch (e: any) {
      error(e);
    } 
  }

  private cloneTables(tables: ITableWithLinks[]) {
    return tables.map((a) => ({ ...a }))
  }

  private setProviderInformation(provider: Record<string, string>) {
    this.providerInfo = provider;
  }

  private setDataSources (dataSources: IDataSource[]) {
    this.dataSources = dataSources
    this.setHasDataSources(dataSources && dataSources.length > 0)
  }

  public resetDataObjects() {
    this.dataObjects = []
  }
  private setDataObjects(dataObjects: IDataObject[]) {
    this.dataObjects = dataObjects
  }
  public setInitialDataObjects(dataObjects: IDataObject[]) {
    this.initialDataObjects = dataObjects
  }

  private setIsLoading(value: boolean) {
    this.isLoading = value
  }
  private setIsLoadingAiDescriptions(value: boolean) {
    this.isLoadingAiDescriptions = value
  }

  private setSelectedDataRecipe(recipe: IDataRecipe) {
    this.selectedDataRecipeRecord = recipe
  }

  private setDataRecipes(recipes: IDataRecipe[]) {
    this.dataRecipes = recipes
  }

  private setSelectedUser(user: IUserPayload) {
    this.selectedUser = user
  }

  private setAllUsers(users: []) {
    this.allUsers = users
  }

  private setSourceTables(tables: ITable[]) {
    this.sourceTables = tables
  }
  private setSourceTablesWithAi(tables: ITable[]) {
    this.sourceTablesWithAi = tables
  }
  private setHistory(tables: ITableWithLinks[]) {
    this.history = tables
  }
  protected setSampleQuestions(questions: any[]) {
    this.sampleQuestions = questions
  }

  get srcsMap(): ISrcsMap {
    const map: ISrcsMap = {};  // Specify the type here
    this.dataObjects.forEach(src => {
      if (!map[src.source]) map[src.source] = [];
      map[src.source].push(src);
    });
    return map;
  }
}
