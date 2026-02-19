'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Clock, Users, X, CheckCircle, ArrowRight, Search, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['All', 'Strength', 'Cardio', 'Yoga', 'CrossFit', 'Pilates', 'Boxing']

const CLASSES = [
  { id: '1', name: 'Strength Training', category: 'Strength', trainer: 'Jake Morrison', duration: 60, maxSpots: 12, description: 'Progressive overload-based strength program targeting all major muscle groups.', schedules: ['Mon, Wed, Fri — 6:00 AM', 'Tue, Thu — 8:00 PM'], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { id: '2', name: 'HIIT Cardio Blast', category: 'Cardio', trainer: 'Maya Patel', duration: 45, maxSpots: 15, description: 'High-intensity interval training that torches calories and boosts metabolism.', schedules: ['Tue, Thu — 7:00 AM', 'Sat — 9:00 AM'], image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80' },
  { id: '3', name: 'Yoga & Flexibility', category: 'Yoga', trainer: 'Sarah Kim', duration: 75, maxSpots: 20, description: 'A blend of power yoga and deep stretching to improve flexibility and reduce stress.', schedules: ['Daily — 8:00 AM', 'Wed, Fri — 6:30 PM'], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
  { id: '4', name: 'CrossFit WOD', category: 'CrossFit', trainer: 'Carlos Rivera', duration: 60, maxSpots: 10, description: 'Daily Workout of the Day featuring functional movements at high intensity.', schedules: ['Mon–Sat — 5:00 PM', 'Sat, Sun — 8:00 AM'], image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
  { id: '5', name: 'Boxing Fundamentals', category: 'Boxing', trainer: 'Tony Wells', duration: 60, maxSpots: 12, description: 'Learn proper boxing technique while getting an incredible full-body workout.', schedules: ['Mon, Wed — 7:00 PM', 'Sat — 10:00 AM'], image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80' },
  { id: '6', name: 'Pilates Core', category: 'Pilates', trainer: 'Emma Davis', duration: 50, maxSpots: 14, description: 'Core-focused pilates designed to sculpt your midsection and improve posture.', schedules: ['Tue, Thu — 9:00 AM', 'Fri — 5:30 PM'], image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' },
  { id: '7', name: 'Spin & Cycle', category: 'Cardio', trainer: 'Ryan Cooper', duration: 45, maxSpots: 18, description: 'High-energy indoor cycling. Burn up to 600 calories per session.', schedules: ['Mon, Wed, Fri — 5:30 AM', 'Sat — 7:00 AM'], image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800&q=80' },
  { id: '8', name: 'Powerlifting Club', category: 'Strength', trainer: 'Jake Morrison', duration: 90, maxSpots: 8, description: 'Specialized powerlifting coaching focused on squat, bench press, and deadlift.', schedules: ['Tue, Thu, Sat — 7:00 AM'], image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80' },
]

type BookingStatus = 'idle' | 'loading' | 'success' | 'waitlisted' | 'error'

export default function ClassesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<typeof CLASSES[0] | null>(null)
  const [bookingForm, setBookingForm] = useState({ email: '', phone: '', scheduleIndex: 0 })
  const [status, setStatus] = useState<BookingStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errorCode, setErrorCode] = useState('')

  const filtered = CLASSES.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.trainer.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClass) return
    setStatus('loading')
    setErrorMsg('')
    setErrorCode('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass.id,
          email: bookingForm.email,
          guestPhone: bookingForm.phone,
          schedule: selectedClass.schedules[bookingForm.scheduleIndex],
          date: new Date().toISOString(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Booking failed. Please try again.')
        setErrorCode(data.code || '')
        setStatus('error')
        return
      }

      setStatus(data.waitlisted ? 'waitlisted' : 'success')
      setBookingForm({ email: '', phone: '', scheduleIndex: 0 })
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const closeModal = () => { setSelectedClass(null); setStatus('idle'); setErrorMsg(''); setErrorCode('') }

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 px-4 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8192C]/6 rounded-full blur-[100px] pointer-events-none" />
        <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Our Programs</p>
        <h1 className="font-bebas text-6xl md:text-8xl tracking-wide mb-4">All <span className="grad-text">Classes</span></h1>
        <p className="text-gray-500 max-w-lg mx-auto mb-4">150+ weekly classes across all disciplines. Find your perfect workout.</p>
        {/* Membership required notice */}
        <div className="inline-flex items-center gap-2 bg-[#E8192C]/8 border border-[#E8192C]/20 text-[#E8192C] px-4 py-2 rounded-full text-sm">
          <Shield className="w-4 h-4" />
          Active membership required to book classes
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search classes or trainers..." value={search} onChange={e => setSearch(e.target.value)} className="field pl-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-[#E8192C] to-[#FF5722] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Classes grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No classes match your search.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(cls => (
              <div key={cls.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden card-hover group">
                <div className="relative overflow-hidden h-48">
                  <img src={cls.image} alt={cls.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#E8192C]/80 text-xs font-bold">{cls.category.toUpperCase()}</span>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-gray-300 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />{cls.duration}min
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base mb-1">{cls.name}</h3>
                  <p className="text-[#E8192C] text-xs font-medium mb-2">with {cls.trainer}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{cls.description}</p>
                  <div className="space-y-1 mb-4">
                    {cls.schedules.slice(0, 2).map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400"><div className="w-1 h-1 bg-[#E8192C] rounded-full" />{s}</div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500"><Users className="w-3 h-3" />{cls.maxSpots} spots max</div>
                    <button onClick={() => setSelectedClass(cls)} className="px-4 py-2 rounded-lg bg-[#E8192C]/10 border border-[#E8192C]/20 text-[#E8192C] text-xs font-semibold hover:bg-[#E8192C] hover:text-white transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-8 relative animate-scaleIn">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>

            {/* Success */}
            {status === 'success' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-400" /></div>
                <h3 className="font-bebas text-3xl tracking-wide mb-2">Booking Confirmed!</h3>
                <p className="text-gray-500 text-sm">Your spot in <span className="text-white">{selectedClass.name}</span> is reserved. Check your email for details.</p>
                <button onClick={closeModal} className="btn-red mt-6 px-8 py-2.5 text-sm">Done</button>
              </div>
            )}

            {/* Waitlisted */}
            {status === 'waitlisted' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4"><Clock className="w-8 h-8 text-yellow-400" /></div>
                <h3 className="font-bebas text-3xl tracking-wide mb-2">Added to Waitlist</h3>
                <p className="text-gray-500 text-sm">This class is full. You've been added to the waitlist for <span className="text-white">{selectedClass.name}</span>. We'll notify you if a spot opens.</p>
                <button onClick={closeModal} className="btn-ghost mt-6 px-8 py-2.5 text-sm">Close</button>
              </div>
            )}

            {/* Booking form */}
            {(status === 'idle' || status === 'loading' || status === 'error') && (
              <>
                <div className="mb-6">
                  <h3 className="font-bebas text-2xl tracking-wide mb-1">Book {selectedClass.name}</h3>
                  <p className="text-gray-500 text-sm">with {selectedClass.trainer} · {selectedClass.duration}min</p>
                </div>

                {/* Membership notice */}
                <div className="flex items-start gap-3 bg-[#E8192C]/6 border border-[#E8192C]/15 rounded-xl p-3 mb-5">
                  <Shield className="w-4 h-4 text-[#E8192C] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">Enter the <span className="text-white font-medium">email address linked to your membership</span> to book. No membership?{' '}
                    <Link href="/pricing" className="text-[#E8192C] underline" onClick={closeModal}>Purchase one here.</Link>
                  </p>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-3 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 text-sm">{errorMsg}</p>
                      {(errorCode === 'NO_MEMBERSHIP' || errorCode === 'MEMBERSHIP_INACTIVE' || errorCode === 'MEMBERSHIP_EXPIRED') && (
                        <Link href="/pricing" className="text-[#E8192C] text-xs underline mt-1 block" onClick={closeModal}>View membership plans →</Link>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Member Email Address *</label>
                    <input type="email" required className="field" placeholder="your-member@email.com"
                      value={bookingForm.email} onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Phone (optional)</label>
                    <input type="tel" className="field" placeholder="+1 (555) 000-0000"
                      value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Select Schedule *</label>
                    <select className="field" value={bookingForm.scheduleIndex} onChange={e => setBookingForm({ ...bookingForm, scheduleIndex: +e.target.value })}>
                      {selectedClass.schedules.map((s, i) => <option key={i} value={i} className="bg-[#111]">{s}</option>)}
                    </select>
                  </div>
                  <button type="submit" disabled={status === 'loading'} className="btn-red w-full py-3 mt-2 flex items-center justify-center gap-2">
                    {status === 'loading' ? 'Verifying membership...' : 'Confirm Booking'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}