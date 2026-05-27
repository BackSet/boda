import { useCallback, useEffect } from 'react'
import type { InvitationRevealPhase } from '../lib/invitation-reveal-context'

const OPENED_KEY_PREFIX = 'boda-invite-opened-'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wasOpenedInSession(token: string): boolean {
  try {
    return sessionStorage.getItem(`${OPENED_KEY_PREFIX}${token}`) === '1'
  } catch {
    return false
  }
}

function markOpenedInSession(token: string) {
  try {
    sessionStorage.setItem(`${OPENED_KEY_PREFIX}${token}`, '1')
  } catch {
    // no-op
  }
}

export function useInvitationReveal(
  token: string,
  dataReady: boolean,
  setPhase: (phase: InvitationRevealPhase) => void,
  phase: InvitationRevealPhase,
) {
  useEffect(() => {
    if (!dataReady) {
      setPhase('loading')
      return
    }

    if (prefersReducedMotion() || wasOpenedInSession(token)) {
      setPhase('revealed')
      return
    }

    setPhase('sealed')
  }, [dataReady, token, setPhase])

  const openEnvelope = useCallback(() => {
    if (phase !== 'sealed') {
      return
    }

    if (prefersReducedMotion()) {
      markOpenedInSession(token)
      setPhase('revealed')
      return
    }

    setPhase('opening')
    window.setTimeout(() => {
      markOpenedInSession(token)
      setPhase('revealed')
    }, 2200)
  }, [phase, token, setPhase])

  return { openEnvelope }
}
