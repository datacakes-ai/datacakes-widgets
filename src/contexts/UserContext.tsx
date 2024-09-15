import { createContext } from 'react'
import { UserStore } from '../stores/UserStore'

export const UserContext = createContext<UserStore>({} as any)
