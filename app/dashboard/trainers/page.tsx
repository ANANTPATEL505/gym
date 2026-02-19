'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { Plus, Search, Edit2, Trash2, X, CheckCircle, RefreshCw, Star, Clock } from 'lucide-react'

type Trainer = { id: string; name: string; email: string; phone?: string | null; specialty: string[]; bio?: string | null; image?: string | null; experience: number; rating: number; _count?: { classes: number } }
const emptyForm = { name: '', email: '', phone: '', specialty: '', bio: '', image: '', experience: 1, rating: 5.0 }

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<Trainer | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchTrainers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trainers')
      if (res.ok) setTrainers(await res.json())
      else throw new Error()
    } catch {
      setTrainers([
        { id: 't1', name: 'Jake Morrison', email: 'jake@ironpeak.com', phone: '+1-555-0201', specialty: ['Powerlifting', 'Strength'], bio: 'Former Division I athlete. NSCA-certified with 12 years experience.', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&q=70', experience: 12, rating: 4.9, _count: { classes: 2 } },
        { id: 't2', name: 'Maya Patel', email: 'maya@ironpeak.com', phone: '+1-555-0202', specialty: ['HIIT', 'Metabolic Conditioning'], bio: 'High-energy coach with competitive athletics background.', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&q=70', experience: 8, rating: 4.8, _count: { classes: 2 } },
        { id: 't3', name: 'Sarah Kim', email: 'sarah@ironpeak.com', phone: '+1-555-0203', specialty: ['Yoga', 'Mindfulness', 'Flexibility'], bio: '10 years of yoga teaching with a 500hr RYT certification.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&q=70', experience: 10, rating: 5.0, _count: { classes: 2 } },
        { id: 't4', name: 'Carlos Rivera', email: 'carlos@ironpeak.com', phone: '+1-555-0204', specialty: ['CrossFit', 'Functional Fitness'], bio: 'CrossFit Level 3 coach and former competitive athlete.', image: 'https://images.unsplash.com/photo-1567013127542-490d757e6349?w=300&q=70', experience: 9, rating: 4.9, _count: { classes: 1 } },
      ])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchTrainers() }, [fetchTrainers])

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.some(s => s.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd = () => { setForm(emptyForm); setModal('add') }
  const openEdit = (t: Trainer) => {
    setEditTarget(t)
    setForm({ name: t.name, email: t.email, phone: t.phone || '', specialty: t.specialty.join(', '), bio: t.bio || '', image: t.image || '', experience: t.experience, rating: t.rating })
    setModal('edit')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = { ...form, specialty: form.specialty.split(',').map(s => s.trim()).filter(Boolean), experience: Number(form.experience), rating: Number(form.rating) }
    try {
      const url = modal === 'add' ? '/api/trainers' : `/api/trainers/${editTarget?.id}`
      const res = await fetch(url, { method: modal === 'add' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const saved = res.ok ? await res.json() : { ...payload, id: editTarget?.id || Date.now().toString() }
      if (modal === 'add') setTrainers(p => [{ ...saved, _count: { classes: 0 } }, ...p])
      else setTrainers(p => p.map(t => t.id === editTarget?.id ? { ...t, ...saved } : t))
    } finally {
      setSubmitting(false); setModal(null)
      setSuccessMsg(modal === 'add' ? 'Trainer added!' : 'Trainer updated!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    try { await fetch(`/api/trainers/${id}`, { method: 'DELETE' }) } finally {
      setTrainers(p => p.filter(t => t.id !== id)); setDeleteConfirm(null)
      setSuccessMsg('Trainer removed.'); setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between z-10">
          <div><h1 className="font-bebas text-2xl tracking-wide">Trainers</h1><p className="text-gray-600 text-xs">{trainers.length} total trainers</p></div>
          <div className="flex items-center gap-3">
            <button onClick={fetchTrainers} className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={openAdd} className="btn-red text-sm py-2 px-4 flex items-center gap-2"><Plus className="w-4 h-4" />Add Trainer</button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {successMsg && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm animate-slideDown"><CheckCircle className="w-4 h-4" />{successMsg}</div>}

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input type="text" placeholder="Search trainers..." value={search} onChange={e => setSearch(e.target.value)} className="field pl-9 w-full" />
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500"><div className="w-8 h-8 border-2 border-[#E8192C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(trainer => (
                <div key={trainer.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden card-hover group">
                  <div className="relative h-40 bg-[#1a0608]">
                    {trainer.image && <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover object-top opacity-70 group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(trainer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />)}
                      <span className="text-gray-400 text-xs ml-1">{trainer.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base">{trainer.name}</h3>
                      <span className="badge badge-active text-xs">{trainer._count?.classes ?? 0} classes</span>
                    </div>
                    <p className="text-gray-600 text-xs mb-2">{trainer.email}</p>
                    {trainer.bio && <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{trainer.bio}</p>}
                    <div className="flex flex-wrap gap-1.5 mb-3">{trainer.specialty.slice(0, 3).map(s => <span key={s} className="badge badge-inactive text-xs">{s}</span>)}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-4"><Clock className="w-3 h-3" />{trainer.experience} yrs experience</div>
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <button onClick={() => openEdit(trainer)} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-all flex items-center justify-center gap-1.5"><Edit2 className="w-3 h-3" />Edit</button>
                      <button onClick={() => setDeleteConfirm(trainer.id)} className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all flex items-center justify-center gap-1.5"><Trash2 className="w-3 h-3" />Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && !loading && <div className="col-span-3 py-16 text-center text-gray-600">No trainers found.</div>}
            </div>
          )}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full p-8 relative animate-scaleIn max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="font-bebas text-2xl tracking-wide mb-6">{modal === 'add' ? 'Add New Trainer' : 'Edit Trainer'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1.5">Full Name *</label><input type="text" required className="field" placeholder="John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5">Email *</label><input type="email" required className="field" placeholder="john@ironpeak.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Phone</label><input type="tel" className="field" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Specialties (comma-separated)</label><input type="text" className="field" placeholder="Strength, HIIT, Olympic Lifting" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Bio</label><textarea rows={3} className="field resize-none" placeholder="Short professional bio..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-500 mb-1.5">Years Experience</label><input type="number" min="0" max="50" className="field" value={form.experience} onChange={e => setForm({ ...form, experience: +e.target.value })} /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5">Rating (0–5)</label><input type="number" min="0" max="5" step="0.1" className="field" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} /></div>
              </div>
              <div><label className="block text-xs text-gray-500 mb-1.5">Profile Image URL</label><input type="url" className="field" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
              {form.image && <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#E8192C]/30"><img src={form.image} alt="Preview" className="w-full h-full object-cover object-top" /></div>}
              <button type="submit" disabled={submitting} className="btn-red w-full py-3 mt-2">{submitting ? 'Saving...' : modal === 'add' ? 'Add Trainer' : 'Save Changes'}</button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-8 text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-400" /></div>
            <h3 className="font-semibold text-lg mb-2">Remove Trainer?</h3>
            <p className="text-gray-500 text-sm mb-6">Their assigned classes will also be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-sm transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}