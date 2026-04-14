import { Navigate, Outlet } from 'react-router-dom'
import { isAdminAuthenticated } from '../../lib/adminAuth'

export function AdminProtectedRoute() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
