'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Strength:  { bg: 'bg-[#E8192C]/15', text: 'text-[#f87171]', border: 'border-[#E8192C]/30' },
  Cardio:    { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  Yoga:      { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  CrossFit:  { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Boxing:    { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  Pilates:   { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30' },
}

const SCHEDULE: Record<string, { name: string; trainer: string; category: string; duration: number; time: string }[]> = {
  Monday: [
    { time: '06:00', name: 'Strength Training', trainer: 'Jake Morrison', category: 'Strength', duration: 60 },
    { time: '07:00', name: 'HIIT Cardio Blast', trainer: 'Maya Patel', category: 'Cardio', duration: 45 },
    { time: '08:00', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
    { time: '17:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '19:00', name: 'Boxing Fundamentals', trainer: 'Tony Wells', category: 'Boxing', duration: 60 },
  ],
  Tuesday: [
    { time: '07:00', name: 'HIIT Cardio Blast', trainer: 'Maya Patel', category: 'Cardio', duration: 45 },
    { time: '08:00', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
    { time: '09:00', name: 'Pilates Core', trainer: 'Emma Davis', category: 'Pilates', duration: 50 },
    { time: '17:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '20:00', name: 'Strength Training', trainer: 'Jake Morrison', category: 'Strength', duration: 60 },
  ],
  Wednesday: [
    { time: '06:00', name: 'Strength Training', trainer: 'Jake Morrison', category: 'Strength', duration: 60 },
    { time: '05:00', name: 'Spin & Cycle', trainer: 'Ryan Cooper', category: 'Cardio', duration: 45 },
    { time: '08:00', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
    { time: '17:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '19:00', name: 'Boxing Fundamentals', trainer: 'Tony Wells', category: 'Boxing', duration: 60 },
  ],
  Thursday: [
    { time: '07:00', name: 'HIIT Cardio Blast', trainer: 'Maya Patel', category: 'Cardio', duration: 45 },
    { time: '08:00', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
    { time: '07:00', name: 'Powerlifting Club', trainer: 'Jake Morrison', category: 'Strength', duration: 90 },
    { time: '17:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '17:30', name: 'Pilates Core', trainer: 'Emma Davis', category: 'Pilates', duration: 50 },
  ],
  Friday: [
    { time: '06:00', name: 'Strength Training', trainer: 'Jake Morrison', category: 'Strength', duration: 60 },
    { time: '05:30', name: 'Spin & Cycle', trainer: 'Ryan Cooper', category: 'Cardio', duration: 45 },
    { time: '08:00', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
    { time: '17:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '18:30', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
  ],
  Saturday: [
    { time: '07:00', name: 'Powerlifting Club', trainer: 'Jake Morrison', category: 'Strength', duration: 90 },
    { time: '08:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '07:00', name: 'Spin & Cycle', trainer: 'Ryan Cooper', category: 'Cardio', duration: 45 },
    { time: '09:00', name: 'HIIT Cardio Blast', trainer: 'Maya Patel', category: 'Cardio', duration: 45 },
    { time: '10:00', name: 'Boxing Fundamentals', trainer: 'Tony Wells', category: 'Boxing', duration: 60 },
  ],
  Sunday: [
    { time: '08:00', name: 'CrossFit WOD', trainer: 'Carlos Rivera', category: 'CrossFit', duration: 60 },
    { time: '08:00', name: 'Yoga & Flexibility', trainer: 'Sarah Kim', category: 'Yoga', duration: 75 },
    { time: '10:00', name: 'Pilates Core', trainer: 'Emma Davis', category: 'Pilates', duration: 50 },
    { time: '11:00', name: 'HIIT Cardio Blast', trainer: 'Maya Patel', category: 'Cardio', duration: 45 },
  ],
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('Monday')

  const dayClasses = (SCHEDULE[activeDay] || []).sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 px-4 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8192C]/6 rounded-full blur-[100px] pointer-events-none" />
        <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Weekly Timetable</p>
        <h1 className="font-bebas text-6xl md:text-8xl tracking-wide mb-4">
          Class <span className="grad-text">Schedule</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Plan your week. Classes run throughout the day from 5 AM to 9 PM.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {Object.entries(CATEGORY_COLORS).map(([cat, style]) => (
            <span key={cat} className={`badge text-xs ${style.bg} ${style.text} border ${style.border}`}>
              {cat}
            </span>
          ))}
        </div>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {DAYS.map((day) => {
            const count = SCHEDULE[day]?.length ?? 0
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeDay === day
                    ? 'bg-gradient-to-r from-[#E8192C] to-[#FF5722] text-white shadow-lg shadow-[#E8192C]/20'
                    : 'bg-[#111] border border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div>{day.slice(0, 3)}</div>
                <div className="text-xs opacity-70 mt-0.5">{count} classes</div>
              </button>
            )
          })}
        </div>

        {/* Timeline view */}
        <div className="space-y-3">
          {dayClasses.length === 0 ? (
            <div className="text-center py-16 text-gray-600">No classes scheduled for {activeDay}.</div>
          ) : (
            dayClasses.map((cls, i) => {
              const colors = CATEGORY_COLORS[cls.category] || { bg: 'bg-white/5', text: 'text-gray-400', border: 'border-white/10' }
              return (
                <div
                  key={i}
                  className={`flex items-start gap-6 bg-[#111] border border-white/5 rounded-2xl p-6 card-hover group`}
                >
                  {/* Time block */}
                  <div className="text-center shrink-0 w-20">
                    <div className="font-bebas text-2xl tracking-wide grad-text">{cls.time}</div>
                    <div className="text-gray-600 text-xs">{cls.duration} min</div>
                  </div>

                  {/* Color bar */}
                  <div className={`w-1 self-stretch rounded-full ${colors.bg.replace('bg-', 'bg-').replace('/15', '/50')}`} />

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg mb-0.5">{cls.name}</h3>
                        <p className="text-gray-500 text-sm">with {cls.trainer}</p>
                      </div>
                      <span className={`badge text-xs ${colors.bg} ${colors.text} border ${colors.border} shrink-0`}>
                        {cls.category}
                      </span>
                    </div>
                  </div>

                  {/* Book */}
                  <a
                    href="/classes"
                    className="shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 text-sm hover:bg-[#E8192C]/10 hover:text-[#E8192C] hover:border-[#E8192C]/20 transition-all"
                  >
                    Book
                  </a>
                </div>
              )
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}