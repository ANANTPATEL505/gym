'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import { Settings, Save, Building2, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

const DEFAULT_SETTINGS = {
  siteName: 'IronPeak Gym',
  tagline: 'Transform Your Body & Mind',
  contactEmail: 'info@ironpeak.com',
  contactPhone: '+1 (555) 123-4567',
  address: '123 Fitness Street, Gym City, GC 12345',
  businessHours: '24/7',
}

const STORAGE_KEY = 'ironpeak-admin-settings'

export default function DashboardSettingsPage() {
  const [form, setForm] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setForm(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-[#080808]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 z-10">
          <h1 className="font-bebas text-2xl tracking-wide">Settings</h1>
          <p className="text-gray-600 text-xs">Site and contact information (saved in browser)</p>
        </div>

        <div className="p-8 max-w-2xl">
          {saved && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm mb-6">
              <CheckCircle className="w-4 h-4" />
              Settings saved
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-[#E8192C]" />
                Site info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Site name</label>
                  <input
                    type="text"
                    className="field w-full"
                    value={form.siteName}
                    onChange={e => setForm({ ...form, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Tagline</label>
                  <input
                    type="text"
                    className="field w-full"
                    value={form.tagline}
                    onChange={e => setForm({ ...form, tagline: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Mail className="w-4 h-4 text-[#E8192C]" />
                Contact
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="field w-full"
                    value={form.contactEmail}
                    onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Phone</label>
                  <input
                    type="text"
                    className="field w-full"
                    value={form.contactPhone}
                    onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Address</label>
                  <input
                    type="text"
                    className="field w-full"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Business hours</label>
                  <input
                    type="text"
                    className="field w-full"
                    placeholder="e.g. 24/7 or Mon–Fri 6am–10pm"
                    value={form.businessHours}
                    onChange={e => setForm({ ...form, businessHours: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-sm text-gray-500">
              <p>These settings are stored in your browser only. For a production app, save them to a database or environment variables.</p>
            </div>

            <button type="submit" disabled={submitting} className="btn-red flex items-center gap-2 py-3 px-6">
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save settings'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
