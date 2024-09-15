import { createContext } from 'react'
import { SettingsStore } from '../stores/SettingsStore'

export const SettingsContext = createContext<SettingsStore>({} as any)
