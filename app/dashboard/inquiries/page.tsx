'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import {
  MessageSquare, RefreshCw, Search, Mail, User, Trash2, X, CheckCircle
} from 'lucide-react'

const STATUSES = ['UNREAD', 'READ', 'REPLIED']
const STATUS_STYLE: Record<string, string> = {
  UNREAD: 'badge-yellow',
  READ: 'badge-inactive',
  REPLIED: 'badge-active',
}

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  createdAt: string
}

export default function DashboardInquiriesPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [detailModal, setDetailModal] = useState<Contact | null>(null)
  const [statusModal, setStatusModal] = useState<Contact | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchContacts = useCallback(async () => {
    setError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'All') params.set('status', statusFilter)
      const res = await fetch(`/api/contact?${params}`)
      if (!res.ok) throw new Error('Failed to load inquiries')
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    } catch (e) {
      setContacts([])
      setError(e instanceof Error ? e.message : 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    setLoading(true)
    fetchContacts()
  }, [fetchContacts])

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.message.toLowerCase().includes(q)
  })

  const handleUpdateStatus = async () => {
    if (!statusModal || !newStatus) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/contact/${statusModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      await fetchContacts()
      setStatusModal(null)
      setDetailModal(null)
      setSuccessMsg('Status updated')
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
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setContacts(prev => prev.filter(c => c.id !== id))
      setDetailModal(null)
      setSuccessMsg('Inquiry deleted')
    } catch {
      setSuccessMsg('Failed to delete')
    }
    setDeleteConfirm(null)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const unreadCount = contacts.filter(c => c.status === 'UNREAD').length

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="font-bebas text-2xl tracking-wide">Inquiries</h1>
            <p className="text-gray-600 text-xs">{contacts.length} total · {unreadCount} unread</p>
          </div>
          <button onClick={() => { setLoading(true); fetchContacts(); setLoading(false) }} className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white">
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
                placeholder="Search by name, email or message..."
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
                <button onClick={fetchContacts} className="mt-4 btn-red text-sm py-2 px-4">Retry</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left">From</th>
                      <th className="text-left">Message</th>
                      <th className="text-left">Status</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-600">No inquiries found</td>
                      </tr>
                    ) : filtered.map(c => (
                      <tr key={c.id} className={c.status === 'UNREAD' ? 'bg-white/[0.02]' : ''}>
                        <td>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-gray-600">{c.email}</div>
                          {c.phone && <div className="text-xs text-gray-500">{c.phone}</div>}
                        </td>
                        <td className="max-w-xs">
                          <div className="text-sm text-gray-400 line-clamp-2">{c.message}</div>
                        </td>
                        <td>
                          <span className={`badge text-xs ${STATUS_STYLE[c.status] || 'badge-inactive'}`}>{c.status}</span>
                        </td>
                        <td className="text-sm text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setDetailModal(c); setStatusModal(null) }} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs">View</button>
                            <button onClick={() => { setStatusModal(c); setNewStatus(c.status) }} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white text-xs">Status</button>
                            <button onClick={() => setDeleteConfirm(c.id)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
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

      {detailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-8 relative animate-scaleIn">
            <button onClick={() => setDetailModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="font-bebas text-xl tracking-wide mb-4">Inquiry</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">Name:</span> {detailModal.name}</div>
              <div><span className="text-gray-500">Email:</span> <a href={`mailto:${detailModal.email}`} className="text-[#E8192C] hover:underline">{detailModal.email}</a></div>
              {detailModal.phone && <div><span className="text-gray-500">Phone:</span> {detailModal.phone}</div>}
              <div className="pt-3 border-t border-white/5">
                <span className="text-gray-500 block mb-1">Message:</span>
                <p className="text-gray-300 whitespace-pre-wrap">{detailModal.message}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => { setStatusModal(detailModal); setNewStatus(detailModal.status); setDetailModal(null) }} className="btn-red text-sm py-2 px-4">Change status</button>
                <button onClick={() => { setDeleteConfirm(detailModal.id); setDetailModal(null) }} className="btn-ghost text-sm py-2 px-4 text-red-400">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {statusModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 relative">
            <button onClick={() => setStatusModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="font-bebas text-xl tracking-wide mb-4">Update status</h3>
            {statusModal && <p className="text-sm text-gray-500 mb-2">From: {statusModal.name}</p>}
            <select className="field w-full mb-4" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
            </select>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStatusModal(null)} className="btn-ghost flex-1 py-2.5">Cancel</button>
              <button type="button" onClick={handleUpdateStatus} disabled={submitting} className="btn-red flex-1 py-2.5">{submitting ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 text-center">
            <p className="font-semibold mb-2">Delete this inquiry?</p>
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
