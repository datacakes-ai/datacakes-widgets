import { useContext } from 'react'
import { SettingsContext } from '../contexts/SettingsContext'

const useSettings = () => {
  return useContext(SettingsContext)
}
export default useSettings
