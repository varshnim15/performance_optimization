import type { Metadata } from 'next'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Performance Optimizer Dashboard',
  description: 'AI-Powered Monitoring & Predictive Analytics Platform',
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
})

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
