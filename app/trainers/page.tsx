'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Star, Instagram, Mail, Award, Clock } from 'lucide-react'

type Trainer = {
  id: string
  name: string
  email: string
  phone?: string | null
  specialty: string[]
  bio?: string | null
  image?: string | null
  experience: number
  rating: number
  _count?: { classes: number }
}

const TRAINERS_FALLBACK = [
  {
    id: '1',
    name: 'Jake Morrison',
    title: 'Head Strength Coach',
    experience: 12,
    rating: 4.9,
    reviews: 214,
    specialty: ['Powerlifting', 'Strength', 'Olympic Lifting'],
    bio: 'Former Division I athlete and NSCA-certified coach with 12 years of experience coaching everyone from beginners to competitive powerlifters. Jake has helped 500+ members hit their strength goals.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    classes: ['Strength Training', 'Powerlifting Club'],
    certifications: ['NSCA-CSCS', 'USAW Level 2'],
  },
  {
    id: '2',
    name: 'Maya Patel',
    title: 'HIIT & Cardio Specialist',
    experience: 8,
    rating: 4.8,
    reviews: 187,
    specialty: ['HIIT', 'Metabolic Conditioning', 'Sprint Training'],
    bio: 'Maya is a high-energy coach with a background in competitive athletics. Her HIIT sessions are legendary for their intensity and the incredible results members achieve in just weeks.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80',
    classes: ['HIIT Cardio Blast', 'Spin & Cycle'],
    certifications: ['ACE-CPT', 'TRX Certified'],
  },
  {
    id: '3',
    name: 'Sarah Kim',
    title: 'Yoga & Wellness Coach',
    experience: 10,
    rating: 5.0,
    reviews: 203,
    specialty: ['Vinyasa Yoga', 'Mindfulness', 'Flexibility'],
    bio: 'With 10 years of yoga teaching and a 500hr RYT certification, Sarah brings a unique blend of eastern and western fitness philosophy. Her classes leave you feeling both worked and restored.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
    classes: ['Yoga & Flexibility', 'Pilates Core'],
    certifications: ['RYT-500', 'Pilates Mat Certified'],
  },
  {
    id: '4',
    name: 'Carlos Rivera',
    title: 'CrossFit Head Coach',
    experience: 9,
    rating: 4.9,
    reviews: 156,
    specialty: ['CrossFit', 'Functional Fitness', 'Kettlebell'],
    bio: 'CrossFit Level 3 coach and former competitive CrossFit athlete, Carlos designs WODs that are challenging for all fitness levels. His coaching style is tough but endlessly encouraging.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e6349?w=600&q=80',
    classes: ['CrossFit WOD'],
    certifications: ['CrossFit L3', 'StrongFirst SFG'],
  },
  {
    id: '5',
    name: 'Tony Wells',
    title: 'Boxing & Combat Coach',
    experience: 15,
    rating: 4.8,
    reviews: 142,
    specialty: ['Boxing', 'Kickboxing', 'Defense'],
    bio: 'Former professional boxer turned fitness coach, Tony brings 15 years of ring experience to the gym floor. His boxing fundamentals class is the highest-rated class we offer.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
    classes: ['Boxing Fundamentals'],
    certifications: ['NASM-CPT', 'USA Boxing Coach'],
  },
  {
    id: '6',
    name: 'Emma Davis',
    title: 'Pilates & Core Specialist',
    experience: 7,
    rating: 4.9,
    reviews: 128,
    specialty: ['Pilates', 'Core Training', 'Rehabilitation'],
    bio: 'Emma is a comprehensive Pilates instructor specializing in reformer work and functional core training. Her background in physical therapy makes her especially skilled at working with injuries.',
    image: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=600&q=80',
    classes: ['Pilates Core'],
    certifications: ['STOTT Pilates', 'PMA-CPT'],
  },
]

const categoryColors: Record<string, string> = {
  Powerlifting: 'badge-red',
  Strength: 'badge-red',
  'Olympic Lifting': 'badge-orange',
  HIIT: 'badge-orange',
  'Metabolic Conditioning': 'badge-yellow',
  'Sprint Training': 'badge-yellow',
  'Vinyasa Yoga': 'badge-blue',
  Mindfulness: 'badge-blue',
  Flexibility: 'badge-blue',
  CrossFit: 'badge-orange',
  'Functional Fitness': 'badge-yellow',
  Kettlebell: 'badge-red',
  Boxing: 'badge-red',
  Kickboxing: 'badge-red',
  Defense: 'badge-orange',
  Pilates: 'badge-blue',
  'Core Training': 'badge-blue',
  Rehabilitation: 'badge-blue',
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTrainers = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/trainers')
        if (!res.ok) throw new Error('Failed to load trainers')
        const data = await res.json()
        if (Array.isArray(data)) {
          setTrainers(data)
        } else {
          setTrainers([])
        }
      } catch (err) {
        console.error('Error loading trainers:', err)
        setTrainers([])
      } finally {
        setLoading(false)
      }
    }
    loadTrainers()
  }, [])

  const displayTrainers = trainers.length > 0 ? trainers : TRAINERS_FALLBACK

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-16 px-4 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8192C]/6 rounded-full blur-[100px] pointer-events-none" />
        <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">The Team</p>
        <h1 className="font-bebas text-6xl md:text-8xl tracking-wide mb-4">
          Meet Our <span className="grad-text">Trainers</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          World-class coaches with decades of combined experience across all fitness disciplines.
        </p>
      </div>

      {/* Trainers grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-[#E8192C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading trainers...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTrainers.map((trainer) => {
              const title = trainer.specialty?.[0] ? `${trainer.specialty[0]} Specialist` : 'Fitness Coach'
              const reviews = Math.floor((trainer.rating || 5) * 50)
              return (
            <div key={trainer.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden card-hover group">
              {/* Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={trainer.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(trainer.rating || 5) ? 'fill-yellow-400' : 'fill-gray-600 text-gray-600'}`} />
                    ))}
                    <span className="text-gray-300 text-xs ml-1">
                      {(trainer.rating || 5).toFixed(1)} ({reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-0.5">{trainer.name}</h3>
                <p className="text-[#E8192C] text-sm font-medium mb-3">{title}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {trainer.bio || 'Expert fitness coach dedicated to helping you achieve your goals.'}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(trainer.specialty || []).slice(0, 3).map((s) => (
                    <span key={s} className={`badge text-xs ${categoryColors[s] || 'badge-inactive'}`}>
                      {s}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {trainer.experience || 1} yrs exp.
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    {trainer._count?.classes || 0} classes
                  </div>
                  <div className="flex items-center gap-3">
                    <a href={`mailto:${trainer.email}`} className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}