import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api'

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function PedidosPage() {
  const { hasAnyRole } = useAuth()
  const canEdit = hasAnyRole(['admin', 'gerente', 'funcionario'])
  const [pedidos, setPedidos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    id_funcionario: '',
    valor_total: '',
  })

  const funcionariosMap = useMemo(() => {
    const map = new Map()
    funcionarios.forEach((funcionario) => {
      map.set(funcionario.id_funcionario, funcionario.nome)
    })
    return map
  }, [funcionarios])

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const pedidosResponse = await api.get('/pedidos/')
      setPedidos(pedidosResponse.data)

      try {
        const funcionariosResponse = await api.get('/funcionarios/')
        setFuncionarios(funcionariosResponse.data)
      } catch {
        setFuncionarios([])
      }
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao carregar pedidos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        id_funcionario: Number(form.id_funcionario),
        valor_total: Number(form.valor_total),
      }

      if (editId) {
        await api.put(`/pedidos/${editId}`, payload)
      } else {
        await api.post('/pedidos/', payload)
      }

      setEditId(null)
      setForm({ id_funcionario: '', valor_total: '' })
      await loadData()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao salvar pedido.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(item) {
    setEditId(item.id_nota_fiscal)
    setForm({
      id_funcionario: String(item.id_funcionario),
      valor_total: String(item.valor_total),
    })
  }

  function cancelEdit() {
    setEditId(null)
    setForm({ id_funcionario: '', valor_total: '' })
  }

  async function handleDelete(idNotaFiscal) {
    const confirmed = window.confirm('Deseja realmente excluir este pedido?')
    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/pedidos/${idNotaFiscal}`)
      await loadData()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao excluir pedido.')
    }
  }

  const funcionariosDisponiveis = funcionarios.length > 0

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-slate-500">
          Todos os perfis autenticados podem criar, editar e excluir pedidos.
        </p>
      </div>

      {canEdit ? (
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-[220px_220px_auto_auto]"
        >
          {funcionariosDisponiveis ? (
            <select
              value={form.id_funcionario}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, id_funcionario: event.target.value }))
              }
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
            >
              <option value="">Funcionario</option>
              {funcionarios.map((funcionario) => (
                <option key={funcionario.id_funcionario} value={funcionario.id_funcionario}>
                  {funcionario.nome}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              min="1"
              value={form.id_funcionario}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, id_funcionario: event.target.value }))
              }
              placeholder="ID do funcionario"
              required
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
            />
          )}

          <input
            type="number"
            step="0.01"
            min="0"
            value={form.valor_total}
            onChange={(event) => setForm((prev) => ({ ...prev, valor_total: event.target.value }))}
            placeholder="Valor total"
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
              <th className="px-3 py-2">NF</th>
              <th className="px-3 py-2">Funcionario</th>
              <th className="px-3 py-2">Valor</th>
              <th className="px-3 py-2">Data/Hora</th>
              <th className="px-3 py-2">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  Carregando...
                </td>
              </tr>
            ) : pedidos.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={5}>
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              pedidos.map((item) => (
                <tr key={item.id_nota_fiscal} className="border-t border-slate-200">
                  <td className="px-3 py-2">{item.id_nota_fiscal}</td>
                  <td className="px-3 py-2">
                    {funcionariosMap.get(item.id_funcionario) || `ID ${item.id_funcionario}`}
                  </td>
                  <td className="px-3 py-2">{BRL.format(Number(item.valor_total))}</td>
                  <td className="px-3 py-2">
                    {new Date(item.data_hora).toLocaleString('pt-BR')}
                  </td>
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
                        onClick={() => handleDelete(item.id_nota_fiscal)}
                        className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
