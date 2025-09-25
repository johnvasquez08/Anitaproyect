import { ThemeProvider } from '@mui/material/styles'
import { theme } from './'
import CssBaseline from '@mui/material/CssBaseline'

export const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    {children}
  </ThemeProvider>
  )
}
