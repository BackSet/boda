import { Music2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'boda-music-enabled'

type AmbientMusicToggleProps = {
  active?: boolean
}

export function AmbientMusicToggle({ active = true }: AmbientMusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {
      setEnabled(false)
    }
  }, [])

  useEffect(() => {
    if (!active || !enabled || !audioRef.current) {
      return
    }

    audioRef.current.play().catch(() => {
      setEnabled(false)
    })
  }, [active, enabled])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
    } catch {
      // no-op
    }

    if (!audioRef.current) {
      return
    }

    if (next) {
      audioRef.current.play().catch(() => setEnabled(false))
    } else {
      audioRef.current.pause()
    }
  }

  if (!active) {
    return null
  }

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/ambient.mp3"
        onError={() => setAvailable(false)}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={!available}
        title={
          available
            ? enabled
              ? 'Pausar música'
              : 'Reproducir música ambiental'
            : 'Coloca ambient.mp3 en public/audio/'
        }
        className="fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/80 bg-white/95 text-rose-700 shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-rose-300 dark:hover:bg-zinc-800"
        aria-label={enabled ? 'Pausar música' : 'Reproducir música'}
      >
        {enabled ? <Music2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
    </>
  )
}
