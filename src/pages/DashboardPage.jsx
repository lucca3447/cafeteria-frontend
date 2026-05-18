import { useAuth } from '../context/AuthContext.jsx'
import { User, ShieldCheck, Mail, Activity, ArrowUpRight } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Bem-vindo de volta, <span className="font-semibold text-slate-700">{user?.nome}</span>. Aqui está o resumo da sua sessão.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Card 1 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <User className="h-6 w-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Ativo
              <Activity className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Nome de Usuário</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{user?.nome || '-'}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Login / E-mail</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{user?.login || '-'}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Perfil de Acesso</p>
            <p className="mt-1 text-xl font-bold text-slate-900 capitalize">{user?.perfil || '-'}</p>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 shadow-sm text-white">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-brand-100 text-sm font-medium mb-1">Status do Sistema</p>
              <p className="text-2xl font-bold">Online</p>
            </div>
            <button className="mt-4 flex items-center gap-2 text-sm font-medium text-white hover:text-brand-200 transition-colors w-fit">
              Ver relatórios
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
