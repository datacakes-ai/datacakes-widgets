import { createContext } from 'react'
import { AppStore } from '../stores/AppStore'

export const AppContext = createContext<AppStore>({} as any)
