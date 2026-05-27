import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext, type ThemeMode } from './theme-context'

const STORAGE_KEY = 'boda-theme-mode'

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' || saved === 'system'
      ? saved
      : 'system'
  })
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    getSystemTheme(),
  )
  const resolvedTheme = mode === 'system' ? systemTheme : mode

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.setAttribute('data-theme', resolvedTheme)
    root.style.colorScheme = resolvedTheme
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode, resolvedTheme])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemTheme(query.matches ? 'dark' : 'light')
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode: setModeState,
    }),
    [mode, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
