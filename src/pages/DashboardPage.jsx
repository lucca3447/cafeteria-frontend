import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api'
import { DollarSign, Package, TrendingUp, Activity, Loader2 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function DashboardPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const response = await api.get('/pedidos/')
        setPedidos(response.data)
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPedidos()
  }, [])

  // Calculate metrics
  const { vendasHoje, pedidosHoje, ticketMedioHoje, chartData, ultimosPedidos } = useMemo(() => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    let vendasHojeCalc = 0
    let pedidosHojeCalc = 0

    // For the chart: last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(hoje)
      d.setDate(d.getDate() - (6 - i))
      return {
        dateStr: d.toISOString().split('T')[0],
        displayDate: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        total: 0,
      }
    })

    const chartMap = new Map(last7Days.map((d) => [d.dateStr, d]))

    pedidos.forEach((pedido) => {
      const pedidoData = new Date(pedido.data_hora)
      const dateStr = pedidoData.toISOString().split('T')[0]
      const valor = Number(pedido.valor_total)

      // Se for hoje
      if (pedidoData >= hoje) {
        vendasHojeCalc += valor
        pedidosHojeCalc += 1
      }

      // Adicionar ao gráfico se estiver nos últimos 7 dias
      if (chartMap.has(dateStr)) {
        chartMap.get(dateStr).total += valor
      }
    })

    const ticketMedioHojeCalc = pedidosHojeCalc > 0 ? vendasHojeCalc / pedidosHojeCalc : 0

    // Últimos pedidos
    const ultimos = [...pedidos]
      .sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime())
      .slice(0, 5)

    return {
      vendasHoje: vendasHojeCalc,
      pedidosHoje: pedidosHojeCalc,
      ticketMedioHoje: ticketMedioHojeCalc,
      chartData: Array.from(chartMap.values()),
      ultimosPedidos: ultimos,
    }
  }, [pedidos])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Bem-vindo, <span className="font-semibold text-slate-700">{user?.nome}</span>. Aqui está o resumo das vendas.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Vendas Hoje */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Vendas de Hoje</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{BRL.format(vendasHoje)}</p>
          </div>
        </div>

        {/* Pedidos Hoje */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Pedidos Hoje</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{pedidosHoje}</p>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">Ticket Médio (Hoje)</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{BRL.format(ticketMedioHoje)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-500" />
            Faturamento (Últimos 7 dias)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [BRL.format(value), 'Faturamento']}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos Pedidos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Últimos Pedidos</h2>
          <div className="space-y-4">
            {ultimosPedidos.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum pedido recente.</p>
            ) : (
              ultimosPedidos.map((pedido) => (
                <div key={pedido.id_nota_fiscal} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Pedido #{pedido.id_nota_fiscal}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(pedido.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">{BRL.format(Number(pedido.valor_total))}</p>
                    <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase">
                      {pedido.status || 'concluído'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
