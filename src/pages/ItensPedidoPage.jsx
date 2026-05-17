import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api'

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function ItensPedidoPage() {
  const { hasAnyRole } = useAuth()
  const canEdit = hasAnyRole(['admin', 'gerente', 'funcionario'])
  const [itens, setItens] = useState([])
  const [produtos, setProdutos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    quantidade: '',
    subtotal: '',
    id_produto: '',
    id_nota_fiscal: '',
  })

  const produtosMap = useMemo(() => {
    const map = new Map()
    produtos.forEach((produto) => {
      map.set(produto.id_produto, produto.nome)
    })
    return map
  }, [produtos])

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [itensResponse, produtosResponse, pedidosResponse] = await Promise.all([
        api.get('/itens-pedido/'),
        api.get('/produtos/'),
        api.get('/pedidos/'),
      ])

      setItens(itensResponse.data)
      setProdutos(produtosResponse.data)
      setPedidos(pedidosResponse.data)
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao carregar itens do pedido.')
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
        quantidade: Number(form.quantidade),
        subtotal: Number(form.subtotal),
        id_produto: Number(form.id_produto),
        id_nota_fiscal: Number(form.id_nota_fiscal),
      }

      if (editId) {
        await api.put(`/itens-pedido/${editId}`, payload)
      } else {
        await api.post('/itens-pedido/', payload)
      }

      setEditId(null)
      setForm({
        quantidade: '',
        subtotal: '',
        id_produto: '',
        id_nota_fiscal: '',
      })
      await loadData()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao salvar item do pedido.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(item) {
    setEditId(item.id_item_pedido)
    setForm({
      quantidade: String(item.quantidade),
      subtotal: String(item.subtotal),
      id_produto: String(item.id_produto),
      id_nota_fiscal: String(item.id_nota_fiscal),
    })
  }

  function cancelEdit() {
    setEditId(null)
    setForm({
      quantidade: '',
      subtotal: '',
      id_produto: '',
      id_nota_fiscal: '',
    })
  }

  async function handleDelete(idItemPedido) {
    const confirmed = window.confirm('Deseja realmente excluir este item do pedido?')
    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/itens-pedido/${idItemPedido}`)
      await loadData()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Erro ao excluir item do pedido.')
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">Itens do Pedido</h1>
        <p className="text-sm text-slate-500">
          Todos os perfis autenticados podem criar, editar e excluir itens.
        </p>
      </div>

      {canEdit ? (
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-[140px_180px_220px_220px_auto_auto]"
        >
          <input
            type="number"
            min="1"
            step="1"
            value={form.quantidade}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, quantidade: event.target.value }))
            }
            placeholder="Quantidade"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={form.subtotal}
            onChange={(event) => setForm((prev) => ({ ...prev, subtotal: event.target.value }))}
            placeholder="Subtotal"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
          />

          <select
            value={form.id_produto}
            onChange={(event) => setForm((prev) => ({ ...prev, id_produto: event.target.value }))}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
          >
            <option value="">Produto</option>
            {produtos.map((produto) => (
              <option key={produto.id_produto} value={produto.id_produto}>
                {produto.nome}
              </option>
            ))}
          </select>

          <select
            value={form.id_nota_fiscal}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, id_nota_fiscal: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-slate-900 focus:ring-2"
          >
            <option value="">Nota fiscal</option>
            {pedidos.map((pedido) => (
              <option key={pedido.id_nota_fiscal} value={pedido.id_nota_fiscal}>
                NF {pedido.id_nota_fiscal}
              </option>
            ))}
          </select>

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
              <th className="px-3 py-2">Pedido</th>
              <th className="px-3 py-2">Produto</th>
              <th className="px-3 py-2">Quantidade</th>
              <th className="px-3 py-2">Subtotal</th>
              <th className="px-3 py-2">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={6}>
                  Carregando...
                </td>
              </tr>
            ) : itens.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500" colSpan={6}>
                  Nenhum item encontrado.
                </td>
              </tr>
            ) : (
              itens.map((item) => (
                <tr key={item.id_item_pedido} className="border-t border-slate-200">
                  <td className="px-3 py-2">{item.id_item_pedido}</td>
                  <td className="px-3 py-2">NF {item.id_nota_fiscal}</td>
                  <td className="px-3 py-2">
                    {produtosMap.get(item.id_produto) || `ID ${item.id_produto}`}
                  </td>
                  <td className="px-3 py-2">{item.quantidade}</td>
                  <td className="px-3 py-2">{BRL.format(Number(item.subtotal))}</td>
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
                        onClick={() => handleDelete(item.id_item_pedido)}
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
