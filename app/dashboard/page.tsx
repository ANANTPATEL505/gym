'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import {
  Users, Calendar, Activity, MessageSquare,
  TrendingUp, TrendingDown, Dumbbell, Clock,
  CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react'

type Stats = {
  totalMembers: number
  activeMembers: number
  totalBookings: number
  todayBookings: number
  totalClasses: number
  totalContacts: number
  unreadContacts: number
  revenue: { starter: number; pro: number; elite: number; total: number }
  recentBookings: {
    id: string
    guestName: string | null
    guestEmail: string | null
    status: string
    createdAt: string
    gymClass: { name: string }
  }[]
  membersByPlan: { plan: string; _count: { plan: number } }[]
}

const PLAN_PRICES: Record<string, number> = { STARTER: 29, PRO: 59, ELITE: 99 }

function StatCard({ label, value, icon: Icon, change, positive, sub }: {
  label: string; value: string | number; icon: any; change?: string; positive?: boolean; sub?: string
}) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E8192C]/10 flex items-center justify-center text-[#E8192C]">
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="font-bebas text-4xl tracking-wide grad-text mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
      {sub && <div className="text-gray-700 text-xs mt-1">{sub}</div>}
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'badge-active',
  CANCELLED: 'badge-red',
  WAITLISTED: 'badge-yellow',
  COMPLETED: 'badge-blue',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    setError(null)
    try {
      const res = await fetch('/api/dashboard/stats')
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to load stats')
      }
      const data = await res.json()
      setStats(data)
    } catch (err) {
      setStats(null)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  const refresh = () => { setRefreshing(true); loadStats() }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#E8192C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen bg-[#080808]">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <p className="text-red-400 mb-2">{error || 'Failed to load dashboard'}</p>
            <p className="text-gray-500 text-sm mb-4">Ensure the database is running. Run: npm run db:push then npm run db:seed</p>
            <button onClick={() => { setLoading(true); loadStats() }} className="btn-red py-2 px-6">Retry</button>
          </div>
        </div>
      </div>
    )
  }

  const totalRevenue = stats?.revenue?.total ?? 0
  const planData = stats?.membersByPlan ?? []

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="font-bebas text-2xl tracking-wide">Dashboard</h1>
            <p className="text-gray-600 text-xs">Overview of all gym operations</p>
          </div>
          <button
            onClick={refresh}
            className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-400 hover:text-white transition-colors ${refreshing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard label="Total Members" value={stats?.totalMembers?.toLocaleString() ?? '—'} icon={Users} change="+12%" positive sub={`${stats?.activeMembers} active`} />
            <StatCard label="Today's Bookings" value={stats?.todayBookings ?? '—'} icon={Calendar} change="+8%" positive sub={`${stats?.totalBookings.toLocaleString()} all time`} />
            <StatCard label="Monthly Revenue" value={`$${Math.round(totalRevenue / 12).toLocaleString()}`} icon={TrendingUp} change="+15%" positive sub="All plans combined" />
            <StatCard label="Unread Inquiries" value={stats?.unreadContacts ?? '—'} icon={MessageSquare} sub={`${stats?.totalContacts} total contacts`} />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 lg:col-span-2">
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E8192C]" />
                Revenue by Plan
              </h2>
              <div className="space-y-5">
                {planData.map((item) => {
                  const price = PLAN_PRICES[item.plan] ?? 0
                  const rev = price * (item._count?.plan ?? 0)
                  const pct = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0
                  return (
                    <div key={item.plan}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`badge text-xs ${item.plan === 'STARTER' ? 'badge-inactive' : item.plan === 'PRO' ? 'badge-active' : 'badge-yellow'}`}>
                            {item.plan}
                          </span>
                          <span className="text-gray-400">{(item._count?.plan ?? 0).toLocaleString()} members</span>
                        </div>
                        <div className="font-semibold">
                          ${rev.toLocaleString()}/mo
                          <span className="text-gray-600 font-normal ml-2">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E8192C] to-[#FF5722] rounded-full transition-all duration-1000"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Monthly Revenue</span>
                  <span className="font-bebas text-2xl grad-text">${totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col">
              <h2 className="font-semibold mb-6 flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#E8192C]" />
                Quick Stats
              </h2>
              <div className="space-y-4 flex-1">
                {[
                  { label: 'Active Classes', value: stats?.totalClasses ?? 0, icon: Dumbbell },
                  { label: 'Avg Bookings/Day', value: Math.round((stats?.totalBookings ?? 0) / 30), icon: Calendar },
                  { label: 'Member Retention', value: `${Math.round(((stats?.activeMembers ?? 0) / (stats?.totalMembers || 1)) * 100)}%`, icon: TrendingUp },
                  { label: 'Contact Response', value: `${stats?.unreadContacts} open`, icon: MessageSquare },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-white/4 last:border-0">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Icon className="w-4 h-4 text-gray-600" />
                      {label}
                    </div>
                    <span className="font-semibold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E8192C]" />
                Recent Bookings
              </h2>
              <a href="/dashboard/bookings" className="text-xs text-[#E8192C] hover:text-orange-400 transition-colors">
                View all →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Guest</th>
                    <th className="text-left">Class</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentBookings ?? []).map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8192C]/30 to-[#FF5722]/30 flex items-center justify-center text-xs font-bold text-[#E8192C]">
                            {(b.guestName ?? '?')[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{b.guestName ?? 'Unknown'}</div>
                            <div className="text-xs text-gray-600">{b.guestEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-gray-400">{b.gymClass?.name}</td>
                      <td>
                        <span className={`badge text-xs ${STATUS_STYLE[b.status] || 'badge-inactive'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="text-xs text-gray-500">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}