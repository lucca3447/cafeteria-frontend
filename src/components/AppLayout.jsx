import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { 
  LayoutDashboard, 
  Tags, 
  Package, 
  ShoppingCart, 
  Users, 
  Contact, 
  Truck, 
  Archive, 
  Link2, 
  LogOut,
  Coffee
} from 'lucide-react'

function navClassName({ isActive }) {
  const base =
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group'
  return isActive 
    ? `${base} bg-brand-50 text-brand-700` 
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`
}

function iconClassName({ isActive }) {
  const base = 'h-5 w-5 transition-colors'
  return isActive ? `${base} text-brand-600` : `${base} text-slate-400 group-hover:text-slate-600`
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white shadow-sm flex flex-col z-10">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-bold leading-tight">Delícias da Cidade</p>
            <p className="text-xs font-medium text-slate-500">Painel de Gestão</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Menu Principal</p>
            <NavLink to="/dashboard" className={navClassName}>
              {({ isActive }) => <><LayoutDashboard className={iconClassName({ isActive })} /> Dashboard</>}
            </NavLink>
            <NavLink to="/cozinha" className={navClassName}>
              {({ isActive }) => <><Coffee className={iconClassName({ isActive })} /> Cozinha</>}
            </NavLink>
            <NavLink to="/categorias" className={navClassName}>
              {({ isActive }) => <><Tags className={iconClassName({ isActive })} /> Categorias</>}
            </NavLink>
            <NavLink to="/produtos" className={navClassName}>
              {({ isActive }) => <><Package className={iconClassName({ isActive })} /> Produtos</>}
            </NavLink>
            <NavLink to="/pedidos" className={navClassName}>
              {({ isActive }) => <><ShoppingCart className={iconClassName({ isActive })} /> Pedidos</>}
            </NavLink>
          </div>

          {canManage && (
            <div className="mt-8 space-y-1">
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Administração</p>
              <NavLink to="/usuarios" className={navClassName}>
                {({ isActive }) => <><Users className={iconClassName({ isActive })} /> Usuários</>}
              </NavLink>
              <NavLink to="/funcionarios" className={navClassName}>
                {({ isActive }) => <><Contact className={iconClassName({ isActive })} /> Funcionários</>}
              </NavLink>
              <NavLink to="/fornecedores" className={navClassName}>
                {({ isActive }) => <><Truck className={iconClassName({ isActive })} /> Fornecedores</>}
              </NavLink>
              <NavLink to="/estoque" className={navClassName}>
                {({ isActive }) => <><Archive className={iconClassName({ isActive })} /> Estoque</>}
              </NavLink>
              <NavLink to="/fornecedor-produto" className={navClassName}>
                {({ isActive }) => <><Link2 className={iconClassName({ isActive })} /> Fornecedor-Produto</>}
              </NavLink>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-sm">
                {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.nome}</p>
                <p className="truncate text-xs font-medium text-slate-500 capitalize">{user?.perfil}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
