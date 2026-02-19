'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import {
  Users, Plus, Search, Filter, Edit2, Trash2,
  X, CheckCircle, ChevronDown, RefreshCw, Download
} from 'lucide-react'

const PLANS = ['STARTER', 'PRO', 'ELITE']
const STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED']

type Member = {
  id: string
  name: string
  email: string
  phone?: string | null
  plan: string
  status: string
  joinedAt: string
  _count?: { bookings: number }
}

const PLAN_BADGE: Record<string, string> = {
  STARTER: 'badge-inactive',
  PRO: 'badge-active',
  ELITE: 'badge-yellow',
}
const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'badge-active',
  INACTIVE: 'badge-inactive',
  SUSPENDED: 'badge-red',
}

const emptyForm = { name: '', email: '', phone: '', plan: 'STARTER', status: 'ACTIVE' }

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<Member | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/members')
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to load members')
      }
      const data = await res.json()
      setMembers(Array.isArray(data) ? data : [])
    } catch (e) {
      setMembers([])
      setError(e instanceof Error ? e.message : 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === 'All' || m.plan === planFilter
    const matchStatus = statusFilter === 'All' || m.status === statusFilter
    return matchSearch && matchPlan && matchStatus
  })

  const openAdd = () => { setForm(emptyForm); setModal('add') }
  const openEdit = (m: Member) => {
    setEditTarget(m)
    setForm({ name: m.name, email: m.email, phone: m.phone || '', plan: m.plan, status: m.status })
    setModal('edit')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const method = modal === 'add' ? 'POST' : 'PUT'
      const url = modal === 'add' ? '/api/members' : `/api/members/${editTarget?.id}`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Request failed')
      }
      await fetchMembers()
      setModal(null)
      setSuccessMsg(modal === 'add' ? 'Member added successfully!' : 'Member updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (e) {
      setSuccessMsg(e instanceof Error ? e.message : 'Something went wrong')
      setTimeout(() => setSuccessMsg(''), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setMembers(prev => prev.filter(m => m.id !== id))
      setSuccessMsg('Member removed.')
    } catch {
      setSuccessMsg('Failed to delete member')
    }
    setDeleteConfirm(null)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="font-bebas text-2xl tracking-wide">Members</h1>
            <p className="text-gray-600 text-xs">{members.length} total members</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchMembers} className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={openAdd} className="btn-red text-sm py-2 px-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {(successMsg || error) && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-slideDown ${error ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
              {error ? null : <CheckCircle className="w-4 h-4" />}
              {error || successMsg}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="field pl-9 w-full"
              />
            </div>
            <select
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value)}
              className="field w-auto"
            >
              <option value="All" className="bg-[#111]">All Plans</option>
              {PLANS.map(p => <option key={p} value={p} className="bg-[#111]">{p}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="field w-auto"
            >
              <option value="All" className="bg-[#111]">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-[#E8192C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading members...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-400">
                <p className="mb-2">{error}</p>
                <p className="text-sm text-gray-500">Ensure the database is running and run: npm run db:push then npm run db:seed</p>
                <button onClick={fetchMembers} className="mt-4 btn-red text-sm py-2 px-4">Retry</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left">Member</th>
                      <th className="text-left">Plan</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Bookings</th>
                      <th className="text-left">Joined</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-600">No members found</td>
                      </tr>
                    ) : filtered.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8192C]/20 to-[#FF5722]/20 flex items-center justify-center text-sm font-bold text-[#E8192C] shrink-0">
                              {m.name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{m.name}</div>
                              <div className="text-xs text-gray-600">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge text-xs ${PLAN_BADGE[m.plan] || 'badge-inactive'}`}>{m.plan}</span>
                        </td>
                        <td>
                          <span className={`badge text-xs ${STATUS_BADGE[m.status] || 'badge-inactive'}`}>{m.status}</span>
                        </td>
                        <td className="text-sm text-gray-400">{m._count?.bookings ?? 0}</td>
                        <td className="text-xs text-gray-500">
                          {new Date(m.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirm(m.id)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-8 relative animate-scaleIn">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bebas text-2xl tracking-wide mb-6">
              {modal === 'add' ? 'Add New Member' : 'Edit Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Full Name *</label>
                <input type="text" required className="field" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Email Address *</label>
                <input type="email" required className="field" placeholder="john@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Phone Number</label>
                <input type="tel" className="field" placeholder="+1 (555) 000-0000"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Plan</label>
                  <select className="field" value={form.plan} onChange={e => setForm({ ...form, plan: e.target.value })}>
                    {PLANS.map(p => <option key={p} value={p} className="bg-[#111]">{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Status</label>
                  <select className="field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-red w-full py-3 mt-2">
                {submitting ? 'Saving...' : modal === 'add' ? 'Add Member' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Delete Member?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. All associated bookings will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}