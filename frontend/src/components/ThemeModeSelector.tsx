import type { ThemeMode } from '../lib/theme-context'
import { useTheme } from '../lib/useTheme'

const OPTIONS: Array<{ value: ThemeMode; label: string }> = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
]

export function ThemeModeSelector() {
  const { mode, setMode, resolvedTheme } = useTheme()

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/80 px-2 py-1 text-xs text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100">
      <span className="hidden sm:inline">Tema</span>
      <span className="hidden lg:inline text-zinc-500 dark:text-zinc-400">
        ({resolvedTheme})
      </span>
      <div className="inline-flex rounded-full bg-zinc-100 p-0.5 dark:bg-zinc-800">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`rounded-full px-2.5 py-1 transition ${
              mode === option.value
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
            }`}
            onClick={() => setMode(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
