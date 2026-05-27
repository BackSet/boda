import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { InvitationRevealProvider } from './lib/InvitationRevealProvider'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute'
import { HomePage } from './pages/HomePage'
import { AdminBankAccountsPage } from './pages/admin/AdminBankAccountsPage'
import { AdminContentPage } from './pages/admin/AdminContentPage'
import { AdminEventPage } from './pages/admin/AdminEventPage'
import { AdminFamilyGroupsPage } from './pages/admin/AdminFamilyGroupsPage'
import { AdminInvitationContentPage } from './pages/admin/AdminInvitationContentPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLoveStoryPage } from './pages/admin/AdminLoveStoryPage'
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage'
import { PartnerLayout } from './components/partner/PartnerLayout'
import { PartnerProtectedRoute } from './components/partner/PartnerProtectedRoute'
import { PartnerLoginPage } from './pages/partner/PartnerLoginPage'
import { PartnerLoveStoryPage } from './pages/partner/PartnerLoveStoryPage'
import { InvitationPage } from './pages/InvitationPage'

function App() {
  return (
    <Routes>
      <Route
        element={
          <InvitationRevealProvider>
            <AppShell />
          </InvitationRevealProvider>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/invitacion/:token" element={<InvitationPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/pareja/login" element={<PartnerLoginPage />} />
        <Route element={<PartnerProtectedRoute />}>
          <Route element={<PartnerLayout />}>
            <Route path="/pareja" element={<PartnerLoveStoryPage />} />
          </Route>
        </Route>
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
            <Route path="/admin/overview" element={<AdminOverviewPage />} />
            <Route path="/admin/grupos" element={<AdminFamilyGroupsPage />} />
            <Route path="/admin/evento" element={<AdminEventPage />} />
            <Route path="/admin/contenido" element={<AdminContentPage />} />
            <Route
              path="/admin/contenido-invitacion"
              element={<AdminInvitationContentPage />}
            />
            <Route path="/admin/cuentas" element={<AdminBankAccountsPage />} />
            <Route path="/admin/historia-amor" element={<AdminLoveStoryPage />} />
            <Route path="/admin/invitados" element={<Navigate to="/admin/grupos" replace />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
