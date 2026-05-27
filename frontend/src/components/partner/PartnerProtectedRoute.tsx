import { Navigate, Outlet } from 'react-router-dom'
import { isPartnerAuthenticated } from '../../lib/partnerAuth'

export function PartnerProtectedRoute() {
  if (!isPartnerAuthenticated()) {
    return <Navigate to="/pareja/login" replace />
  }

  return <Outlet />
}
