import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { AppLayout } from './components/AppLayout.jsx'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { CategoriasPage } from './pages/CategoriasPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { ItensPedidoPage } from './pages/ItensPedidoPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { PedidosPage } from './pages/PedidosPage.jsx'
import { ProdutosPage } from './pages/ProdutosPage.jsx'

function LoginRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="p-8 text-center text-slate-600">Carregando...</p>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <LoginPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/itens-pedido" element={<ItensPedidoPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
