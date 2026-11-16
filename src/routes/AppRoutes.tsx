import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PrivateRoute } from './PrivateRoute'
import { RoleRoute } from './RoleRoute'

import { HomePage } from '../pages/public/HomePage'
import { AboutPage } from '../pages/public/AboutPage'
import { CampaignsPage } from '../pages/public/CampaignsPage'
import { CampaignDetailPage } from '../pages/public/CampaignDetailPage'
import { OngsPage } from '../pages/public/OngsPage'
import { ContactPage } from '../pages/public/ContactPage'

import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'

import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'

import { DonorDashboardPage } from '../pages/donor/DonorDashboardPage'
import { DonorCampaignsPage } from '../pages/donor/DonorCampaignsPage'
import { DonationHistoryPage } from '../pages/donor/DonationHistoryPage'
import { DonorProfilePage } from '../pages/donor/DonorProfilePage'
import { DoarItemPage } from '../pages/donor/DoarItemPage'

function RedirectByRole() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const paths: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    DOADOR: '/doador/dashboard',
  }
  return <Navigate to={paths[user.role] || '/doador/dashboard'} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/campanhas" element={<CampaignsPage />} />
      <Route path="/campanhas/:id" element={<CampaignDetailPage />} />
      <Route path="/ongs" element={<OngsPage />} />
      <Route path="/contato" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      {/* Dashboard redirect */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route index element={<RedirectByRole />} />
      </Route>

      {/* Admin */}
      <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/usuarios" element={<AdminDashboardPage />} />
          <Route path="/admin/ongs" element={<AdminDashboardPage />} />
          <Route path="/admin/campanhas" element={<AdminDashboardPage />} />
          <Route path="/admin/doacoes" element={<AdminDashboardPage />} />
        </Route>
      </Route>

      {/* Doador */}
      <Route element={<PrivateRoute />}>
        <Route element={<RoleRoute allowedRoles={['DOADOR']} />}>
          <Route path="/doador/dashboard" element={<DonorDashboardPage />} />
          <Route path="/doador/campanhas" element={<DonorCampaignsPage />} />
          <Route path="/doador/historico" element={<DonationHistoryPage />} />
          <Route path="/doador/perfil" element={<DonorProfilePage />} />
          <Route path="/doador/doar-item" element={<DoarItemPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
