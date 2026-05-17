import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function navClassName({ isActive }) {
  const base =
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100'
  return isActive ? `${base} bg-slate-900 text-white hover:bg-slate-900` : base
}

export function AppLayout() {
  const { user, logout, hasAnyRole } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const canManage = hasAnyRole(['admin', 'gerente'])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-lg font-bold">Delicias da Cidade</p>
            <p className="text-xs text-slate-500">Painel interno</p>
          </div>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/dashboard" className={navClassName}>
              Dashboard
            </NavLink>
            <NavLink to="/categorias" className={navClassName}>
              Categorias
            </NavLink>
            <NavLink to="/produtos" className={navClassName}>
              Produtos
            </NavLink>
            <NavLink to="/pedidos" className={navClassName}>
              Pedidos
            </NavLink>

            {canManage ? (
              <>
                <NavLink to="/usuarios" className={navClassName}>
                  Usuarios
                </NavLink>
                <NavLink to="/funcionarios" className={navClassName}>
                  Funcionarios
                </NavLink>
                <NavLink to="/fornecedores" className={navClassName}>
                  Fornecedores
                </NavLink>
                <NavLink to="/estoque" className={navClassName}>
                  Estoque
                </NavLink>
                <NavLink to="/fornecedor-produto" className={navClassName}>
                  Fornecedor-Produto
                </NavLink>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-semibold">{user?.nome}</p>
              <p className="text-slate-500">{user?.perfil}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
