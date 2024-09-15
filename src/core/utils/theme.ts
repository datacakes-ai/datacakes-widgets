import { createTheme, useTheme } from '@mui/material/styles'
import { createMakeStyles } from 'tss-react'

export const textPrimaryLightColor = '#545454' // used in IDENTIFY JOIN KEYS section drop down

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1200,
      xl: 1280
    }
  },
  palette: {
    primary: {
      main: '#0A191C',
    },
    secondary: {
      main: '#0A191C',
    },
    background: {
      default: `linear-gradient(135deg, #4691ec -80%, #FFFFFF 90.7%)`,
      paper: `linear-gradient(135deg, #DEEBFC66 0%, #FFFFFF 106.7%)`,
    },
    text: {
      primary: '#0A191C',
      disabled: '#9CA3AF',
      secondary: '#FFFFFF',
    },
  },
  typography: {
    fontSize: 14
  }
})

export const { makeStyles } = createMakeStyles({
  useTheme: useTheme as () => typeof theme,
})

export default theme
