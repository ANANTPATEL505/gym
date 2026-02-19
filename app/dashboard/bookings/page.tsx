'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import {
  Calendar, RefreshCw, Search, Filter, Edit2, Trash2, X, CheckCircle, User, Mail
} from 'lucide-react'

const STATUSES = ['CONFIRMED', 'CANCELLED', 'WAITLISTED', 'COMPLETED']
const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'badge-active',
  CANCELLED: 'badge-red',
  WAITLISTED: 'badge-yellow',
  COMPLETED: 'badge-blue',
}
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Booking = {
  id: string
  guestName: string | null
  guestEmail: string | null
  guestPhone: string | null
  memberId: string | null
  status: string
  date: string
  createdAt: string
  gymClass: { name: string; category: string }
  member: { name: string; email: string } | null
  schedule: { dayOfWeek: number; startTime: string } | null
}

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [editModal, setEditModal] = useState<Booking | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'All') params.set('status', statusFilter)
      params.set('limit', '100')
      const res = await fetch(`/api/bookings?${params}`)
      if (!res.ok) throw new Error('Failed to load bookings')
      const data = await res.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (e) {
      setBookings([])
      setError(e instanceof Error ? e.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    setLoading(true)
    fetchBookings()
  }, [fetchBookings])

  const filtered = bookings.filter(b => {
    const name = b.guestName || b.member?.name || ''
    const email = b.guestEmail || b.member?.email || ''
    const q = search.toLowerCase()
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || b.gymClass?.name?.toLowerCase().includes(q)
  })

  const handleUpdateStatus = async () => {
    if (!editModal || !newStatus) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/bookings/${editModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      await fetchBookings()
      setEditModal(null)
      setSuccessMsg('Booking updated')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setSuccessMsg('Failed to update')
      setTimeout(() => setSuccessMsg(''), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setBookings(prev => prev.filter(b => b.id !== id))
      setSuccessMsg('Booking removed')
    } catch {
      setSuccessMsg('Failed to delete')
    }
    setDeleteConfirm(null)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const displayName = (b: Booking) => b.guestName || b.member?.name || '—'
  const displayEmail = (b: Booking) => b.guestEmail || b.member?.email || '—'

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="font-bebas text-2xl tracking-wide">Bookings</h1>
            <p className="text-gray-600 text-xs">{bookings.length} total</p>
          </div>
          <button onClick={() => { setLoading(true); fetchBookings(); setLoading(false) }} className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {successMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${successMsg.startsWith('Failed') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              <CheckCircle className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search by name, email or class..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="field pl-9 w-full"
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="field w-auto">
              <option value="All" className="bg-[#111]">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
            </select>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-[#E8192C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-400">
                <p>{error}</p>
                <button onClick={fetchBookings} className="mt-4 btn-red text-sm py-2 px-4">Retry</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left">Guest / Member</th>
                      <th className="text-left">Class</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-600">No bookings found</td>
                      </tr>
                    ) : filtered.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div className="font-medium">{displayName(b)}</div>
                          <div className="text-xs text-gray-600">{displayEmail(b)}</div>
                        </td>
                        <td>
                          <div>{b.gymClass?.name}</div>
                          <div className="text-xs text-gray-600">{b.gymClass?.category}</div>
                        </td>
                        <td>
                          <span className={`badge text-xs ${STATUS_STYLE[b.status] || 'badge-inactive'}`}>{b.status}</span>
                        </td>
                        <td className="text-sm text-gray-400">
                          {new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditModal(b); setNewStatus(b.status) }} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setDeleteConfirm(b.id)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
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

      {editModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 relative">
            <button onClick={() => setEditModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="font-bebas text-xl tracking-wide mb-4">Update booking status</h3>
            <p className="text-sm text-gray-400 mb-4">{editModal.gymClass?.name} — {displayName(editModal)}</p>
            <select className="field w-full mb-4" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setEditModal(null)} className="btn-ghost flex-1 py-2.5">Cancel</button>
              <button onClick={handleUpdateStatus} disabled={submitting} className="btn-red flex-1 py-2.5">{submitting ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 text-center">
            <p className="font-semibold mb-2">Delete this booking?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 py-2.5">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
