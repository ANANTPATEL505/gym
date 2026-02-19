'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { Plus, Search, Edit2, Trash2, X, CheckCircle, RefreshCw, Clock, Users } from 'lucide-react'

const CATEGORIES = ['STRENGTH', 'CARDIO', 'YOGA', 'CROSSFIT', 'PILATES', 'BOXING', 'CYCLING', 'SWIM']
const CAT_COLORS: Record<string, string> = {
  STRENGTH: 'badge-red', CARDIO: 'badge-orange', YOGA: 'badge-blue',
  CROSSFIT: 'badge-yellow', PILATES: 'badge-blue', BOXING: 'badge-red',
}

type GymClass = { id: string; name: string; description?: string | null; category: string; duration: number; maxSpots: number; image?: string | null; trainerId: string; trainer: { name: string }; _count?: { bookings: number } }
type Trainer = { id: string; name: string }

const emptyForm = { name: '', description: '', category: 'STRENGTH', duration: 60, maxSpots: 20, image: '', trainerId: '' }

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<GymClass[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<GymClass | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [cr, tr] = await Promise.all([fetch('/api/classes'), fetch('/api/trainers')])
      if (cr.ok) setClasses(await cr.json())
      if (tr.ok) setTrainers(await tr.json())
    } catch {
      setTrainers([{ id: 't1', name: 'Jake Morrison' }, { id: 't2', name: 'Maya Patel' }, { id: 't3', name: 'Sarah Kim' }, { id: 't4', name: 'Carlos Rivera' }])
      setClasses([
        { id: '1', name: 'Strength Training', description: 'Progressive overload training for all levels.', category: 'STRENGTH', duration: 60, maxSpots: 12, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=60', trainerId: 't1', trainer: { name: 'Jake Morrison' }, _count: { bookings: 28 } },
        { id: '2', name: 'HIIT Cardio Blast', description: 'High-intensity intervals that torch calories.', category: 'CARDIO', duration: 45, maxSpots: 15, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=60', trainerId: 't2', trainer: { name: 'Maya Patel' }, _count: { bookings: 45 } },
        { id: '3', name: 'Yoga & Flexibility', description: 'Power yoga blended with deep stretching.', category: 'YOGA', duration: 75, maxSpots: 20, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=60', trainerId: 't3', trainer: { name: 'Sarah Kim' }, _count: { bookings: 67 } },
        { id: '4', name: 'CrossFit WOD', description: 'Daily functional movement workouts.', category: 'CROSSFIT', duration: 60, maxSpots: 10, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=60', trainerId: 't4', trainer: { name: 'Carlos Rivera' }, _count: { bookings: 32 } },
      ])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = classes.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.trainer.name.toLowerCase().includes(search.toLowerCase())
    return ms && (catFilter === 'All' || c.category === catFilter)
  })

  const openAdd = () => { setForm({ ...emptyForm, trainerId: trainers[0]?.id || '' }); setModal('add') }
  const openEdit = (c: GymClass) => { setEditTarget(c); setForm({ name: c.name, description: c.description || '', category: c.category, duration: c.duration, maxSpots: c.maxSpots, image: c.image || '', trainerId: c.trainerId }); setModal('edit') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = { ...form, duration: Number(form.duration), maxSpots: Number(form.maxSpots) }
    const trainerName = trainers.find(t => t.id === form.trainerId)?.name || ''
    try {
      const url = modal === 'add' ? '/api/classes' : `/api/classes/${editTarget?.id}`
      const res = await fetch(url, { method: modal === 'add' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const saved = res.ok ? await res.json() : payload
      if (modal === 'add') setClasses(p => [{ ...saved, trainer: { name: trainerName }, _count: { bookings: 0 } }, ...p])
      else setClasses(p => p.map(c => c.id === editTarget?.id ? { ...c, ...saved, trainer: { name: trainerName } } : c))
    } finally {
      setSubmitting(false); setModal(null)
      setSuccessMsg(modal === 'add' ? 'Class created!' : 'Class updated!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    try { await fetch(`/api/classes/${id}`, { method: 'DELETE' }) } finally {
      setClasses(p => p.filter(c => c.id !== id)); setDeleteConfirm(null)
      setSuccessMsg('Class removed.'); setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between z-10">
          <div><h1 className="font-bebas text-2xl tracking-wide">Classes</h1><p className="text-gray-600 text-xs">{classes.length} total classes</p></div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={openAdd} className="btn-red text-sm py-2 px-4 flex items-center gap-2"><Plus className="w-4 h-4" />Add Class</button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {successMsg && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm animate-slideDown"><CheckCircle className="w-4 h-4" />{successMsg}</div>}

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input type="text" placeholder="Search classes..." value={search} onChange={e => setSearch(e.target.value)} className="field pl-9 w-full" />
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="field w-auto">
              <option value="All" className="bg-[#111]">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500"><div className="w-8 h-8 border-2 border-[#E8192C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(cls => (
                <div key={cls.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group card-hover">
                  {cls.image && <div className="h-36 overflow-hidden"><img src={cls.image} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70" /></div>}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base">{cls.name}</h3>
                      <span className={`badge text-xs shrink-0 ${CAT_COLORS[cls.category] || 'badge-inactive'}`}>{cls.category}</span>
                    </div>
                    <p className="text-[#E8192C] text-xs font-medium mb-2">with {cls.trainer.name}</p>
                    {cls.description && <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{cls.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.duration} min</div>
                      <div className="flex items-center gap-1"><Users className="w-3 h-3" />{cls.maxSpots} max</div>
                      <div className="text-[#E8192C]">{cls._count?.bookings ?? 0} booked</div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <button onClick={() => openEdit(cls)} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-all flex items-center justify-center gap-1.5"><Edit2 className="w-3 h-3" />Edit</button>
                      <button onClick={() => setDeleteConfirm(cls.id)} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all flex items-center justify-center gap-1.5"><Trash2 className="w-3 h-3" />Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="col-span-3 py-16 text-center text-gray-600">No classes found.</div>}
            </div>
          )}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-8 relative animate-scaleIn max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="font-bebas text-2xl tracking-wide mb-6">{modal === 'add' ? 'Add New Class' : 'Edit Class'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-xs text-gray-500 mb-1.5">Class Name *</label><input type="text" required className="field" placeholder="e.g. Power Yoga" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Description</label><textarea rows={3} className="field resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1.5">Category</label>
                  <select className="field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs text-gray-500 mb-1.5">Trainer *</label>
                  <select required className="field" value={form.trainerId} onChange={e => setForm({ ...form, trainerId: e.target.value })}>
                    <option value="" className="bg-[#111]">Select trainer...</option>
                    {trainers.map(t => <option key={t.id} value={t.id} className="bg-[#111]">{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1.5">Duration (min)</label><input type="number" min="15" max="180" className="field" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5">Max Spots</label><input type="number" min="1" max="100" className="field" value={form.maxSpots} onChange={e => setForm({ ...form, maxSpots: +e.target.value })} /></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Image URL</label><input type="url" className="field" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
              {form.image && <div className="h-24 rounded-xl overflow-hidden border border-white/5"><img src={form.image} alt="Preview" className="w-full h-full object-cover" /></div>}
              <button type="submit" disabled={submitting} className="btn-red w-full py-3 mt-2">{submitting ? 'Saving...' : modal === 'add' ? 'Create Class' : 'Save Changes'}</button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-400" /></div>
            <h3 className="font-semibold text-lg mb-2">Delete Class?</h3>
            <p className="text-gray-500 text-sm mb-6">All bookings and schedules will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}