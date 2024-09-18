import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'

const useApp = () => {
  return useContext(AppContext)
}
export default useApp
