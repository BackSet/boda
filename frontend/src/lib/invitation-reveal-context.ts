import { createContext, useContext } from 'react'

export type InvitationRevealPhase =
  | 'loading'
  | 'sealed'
  | 'opening'
  | 'revealed'
  | 'error'

type InvitationRevealContextValue = {
  phase: InvitationRevealPhase
  setPhase: (phase: InvitationRevealPhase) => void
}

export const InvitationRevealContext =
  createContext<InvitationRevealContextValue | null>(null)

export function useInvitationRevealContext() {
  const context = useContext(InvitationRevealContext)
  if (!context) {
    throw new Error('useInvitationRevealContext debe usarse dentro de InvitationRevealProvider')
  }
  return context
}
