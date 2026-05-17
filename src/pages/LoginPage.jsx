import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ login: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(form.login, form.senha)
      const next = location.state?.from?.pathname || '/dashboard'
      navigate(next, { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Falha no login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
        <p className="mt-1 text-sm text-slate-500">
          Use seu usuario para acessar o painel.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="login">
              Login
            </label>
            <input
              id="login"
              type="text"
              minLength={3}
              maxLength={50}
              required
              value={form.login}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, login: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              minLength={8}
              maxLength={100}
              required
              value={form.senha}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, senha: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
