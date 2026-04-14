import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'
import { HomePage } from './pages/HomePage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { InvitationPage } from './pages/InvitationPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/invitacion/:token" element={<InvitationPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
