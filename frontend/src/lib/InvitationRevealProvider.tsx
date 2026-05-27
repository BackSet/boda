import { useState, type ReactNode } from 'react'
import {
  InvitationRevealContext,
  type InvitationRevealPhase,
} from './invitation-reveal-context'

export function InvitationRevealProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<InvitationRevealPhase>('loading')

  return (
    <InvitationRevealContext.Provider value={{ phase, setPhase }}>
      {children}
    </InvitationRevealContext.Provider>
  )
}
