import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api'

export function CategoriasPage() {
  const { hasAnyRole } = useAuth()
  const canEdit = hasAnyRole(['admin', 'gerente'])
  const [categorias, setCategorias] = useState([])
  const [descricao, setDescricao] = useState('')
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadCategorias() {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/categorias/')
      setCategorias(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao carregar categorias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategorias()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = { descricao: descricao.trim() }
      if (editId) {
        await api.put(`/categorias/${editId}`, payload)
      } else {
        await api.post('/categorias/', payload)
      }
      setDescricao('')
      setEditId(null)
      await loadCategorias()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao salvar categoria.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(item) {
    setEditId(item.id_categoria)
    setDescricao(item.descricao)
  }

  function cancelEdit() {
    setEditId(null)
    setDescricao('')
  }

  async function handleDelete(idCategoria) {
    const confirmed = window.confirm('Deseja realmente excluir esta categoria?')
    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/categorias/${idCategoria}`)
      await loadCategorias()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao excluir categoria.')
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">Categorias</h1>
        <p className="text-sm text-slate-500">
          {canEdit
            ? 'Seu perfil permite criar, editar e excluir.'
            : 'Seu perfil possui acesso somente de leitura.'}
        </p>
      </div>

      {canEdit ? (
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            type="text"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            placeholder="Descricao da categoria"
            minLength={2}
            maxLength={100}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-70"
          >
            {editId ? 'Atualizar' : 'Criar'}
          </button>
          {editId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
            >
              Cancelar
            </button>
          ) : null}
        </form>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Descricao</th>
              {canEdit ? <th className="px-3 py-2">Acoes</th> : null}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={canEdit ? 3 : 2}>
                  Carregando...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={canEdit ? 3 : 2}>
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            ) : (
              categorias.map((item) => (
                <tr key={item.id_categoria} className="border-t border-slate-200">
                  <td className="px-3 py-2">{item.id_categoria}</td>
                  <td className="px-3 py-2">{item.descricao}</td>
                  {canEdit ? (
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id_categoria)}
                          className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
