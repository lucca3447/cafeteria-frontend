import { useAuth } from '../context/AuthContext.jsx'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Dados da sessao atual retornados por <code>/auth/me</code>.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Nome</p>
          <p className="mt-1 font-semibold">{user?.nome || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Login</p>
          <p className="mt-1 font-semibold">{user?.login || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Perfil</p>
          <p className="mt-1 font-semibold">{user?.perfil || '-'}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Ativo</p>
          <p className="mt-1 font-semibold">{user?.ativo ? 'Sim' : 'Nao'}</p>
        </div>
      </div>
    </section>
  )
}
