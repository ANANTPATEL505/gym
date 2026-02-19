'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Dumbbell, Users, Calendar, Award, Clock, ChevronRight,
  Star, Activity, ArrowRight, CheckCircle, MapPin, Phone, Mail, Zap, Shield, TrendingUp
} from 'lucide-react'

/* ─── Fixed Counter: triggers ONLY when section enters viewport ─── */
function StatCounter({ target, suffix, label, icon: Icon }: {
  target: number; suffix: string; label: string; icon: React.ElementType
}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started || count >= target) return
    const duration = 1800
    const step = target / (duration / 16)
    let cur = 0
    const timer = setInterval(() => {
      cur += step
      if (cur >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(cur))
    }, 16)
    return () => clearInterval(timer)
  }, [started, target])

  return (
    <div ref={ref} className="text-center group">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#E8192C]/10 text-[#E8192C] mb-3 group-hover:bg-[#E8192C]/20 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-bebas text-5xl tracking-wide grad-text">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  )
}

const features = [
  { icon: Dumbbell, title: 'Premium Equipment', desc: 'Over 500 pieces of state-of-the-art cardio and strength machines updated annually.' },
  { icon: Users,   title: 'Expert Trainers',   desc: 'Certified professionals with 10+ years experience guiding every step of your journey.' },
  { icon: Calendar,title: '24/7 Access',        desc: 'Train on your schedule. Our doors never close — weekends, holidays, every day.' },
  { icon: Award,   title: 'Proven Results',     desc: 'Our data-backed programs deliver measurable results within your first 30 days.' },
  { icon: Zap,     title: 'Group Energy',       desc: '150+ weekly classes from HIIT to Yoga, all led by passionate instructors.' },
  { icon: Shield,  title: 'Safe Environment',   desc: 'Sanitized facilities, monitored spaces, and a community that looks out for each other.' },
]

const classes = [
  { name: 'Strength Training',  schedule: 'Mon, Wed, Fri — 6:00 AM', spots: 12, cat: 'STRENGTH', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { name: 'HIIT Cardio',        schedule: 'Tue, Thu — 7:00 AM',       spots: 15, cat: 'CARDIO',   image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80' },
  { name: 'Yoga & Flexibility', schedule: 'Daily — 8:00 AM',          spots: 20, cat: 'YOGA',     image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
  { name: 'CrossFit',           schedule: 'Mon–Sat — 5:00 PM',        spots: 10, cat: 'CROSSFIT', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
]

const testimonials = [
  { name: 'Sarah Johnson',   role: 'Member since 2022', avatar: 'SJ', rating: 5, text: 'Dropped 30 lbs in 4 months. The trainers here genuinely care about your progress — not just selling sessions.' },
  { name: 'Mike Chen',       role: 'Pro Member',        avatar: 'MC', rating: 5, text: 'The programming is elite-level. I came in as a beginner and now I coach my own team after the skills I built here.' },
  { name: 'Emily Rodriguez', role: 'Elite Member',      avatar: 'ER', rating: 5, text: 'Clean, modern, welcoming. The community is the secret weapon. I actually look forward to 5 AM workouts now.' },
]

const plans = [
  { name: 'Starter', price: 29, popular: false, features: ['Gym floor access', 'Basic equipment', 'Locker room', '2 guest passes/mo'] },
  { name: 'Pro',     price: 59, popular: true,  features: ['Everything in Starter', 'Unlimited group classes', 'Personal trainer 2×/mo', 'Nutrition guide'] },
  { name: 'Elite',   price: 99, popular: false, features: ['Everything in Pro', 'Unlimited personal training', 'Recovery suite access', 'Priority booking'] },
]

export default function HomePage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed')
      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSuccess(false), 4000)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Something went wrong.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-[#080808] overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80" alt="IronPeak Gym" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-transparent to-[#080808]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-[#080808]" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8192C]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-8">
            <div className="w-2 h-2 bg-[#E8192C] rounded-full animate-pulse" />
            Open 24/7 · 3 Locations · 2,500+ Members
          </div>
          <h1 className="font-bebas text-[clamp(60px,12vw,140px)] leading-[0.9] tracking-wide mb-6">
            TRANSFORM YOUR<span className="block grad-text">BODY & MIND</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the elite. Train with purpose. IronPeak gives you world-class facilities, expert coaching, and a community that pushes you to your peak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="btn-red text-base px-8 py-4 flex items-center gap-2 justify-center">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/classes" className="btn-ghost text-base px-8 py-4">Explore Classes</Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs animate-bounce">
          <span>SCROLL</span><ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCounter target={2500} suffix="+" label="Active Members"  icon={Users} />
          <StatCounter target={150}  suffix="+" label="Weekly Classes"  icon={Activity} />
          <StatCounter target={25}   suffix=""  label="Expert Trainers" icon={Award} />
          <StatCounter target={12}   suffix=" yrs" label="In Business"  icon={TrendingUp} />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Why IronPeak</p>
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide">Built Different. <span className="grad-text">Built Better.</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-[#111] border border-white/5 rounded-2xl p-8 card-hover group">
                <div className="w-12 h-12 rounded-xl bg-[#E8192C]/10 flex items-center justify-center text-[#E8192C] mb-5 group-hover:bg-[#E8192C]/20 transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section id="classes" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Our Programs</p>
              <h2 className="font-bebas text-5xl md:text-6xl tracking-wide">Popular <span className="grad-text">Classes</span></h2>
            </div>
            <Link href="/classes" className="flex items-center gap-2 text-[#E8192C] hover:text-orange-400 transition-colors font-medium">
              View all classes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((cls) => (
              <div key={cls.name} className="group relative overflow-hidden rounded-2xl cursor-pointer card-hover">
                <img src={cls.image} alt={cls.name} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="self-start px-3 py-1 rounded-full bg-[#E8192C]/80 text-xs font-bold tracking-wider">{cls.cat}</span>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{cls.name}</h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-2"><Clock className="w-3 h-3" />{cls.schedule}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-xs">{cls.spots} spots left</span>
                      <Link href="/classes" className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-semibold hover:bg-[#E8192C] transition-colors">Book</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALLOUT */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#E8192C] to-[#FF5722] p-12 text-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(0,0,0,.3) 20px,rgba(0,0,0,.3) 21px)' }} />
            <div className="relative z-10">
              <h2 className="font-bebas text-5xl md:text-7xl tracking-wide mb-4">START YOUR FREE 7-DAY TRIAL</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">No credit card required. No commitment. Just results.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg">
                Claim Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Success Stories</p>
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide">Real Members. <span className="grad-text">Real Results.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#111] border border-white/5 rounded-2xl p-8 card-hover">
                <div className="flex gap-1 mb-5">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8192C] to-[#FF5722] flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <div><div className="font-semibold text-sm">{t.name}</div><div className="text-gray-500 text-xs">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Membership</p>
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wide">Simple <span className="grad-text">Pricing</span></h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto text-sm">No hidden fees. Cancel anytime. All plans include a 7-day free trial.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-8 flex flex-col ${plan.popular ? 'bg-gradient-to-br from-[#E8192C]/20 to-[#FF5722]/10 border border-[#E8192C]/40 red-glow' : 'bg-[#111] border border-white/5'}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#E8192C] to-[#FF5722] rounded-full text-xs font-bold tracking-wider">MOST POPULAR</div>}
                <h3 className="font-bebas text-2xl tracking-wide mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6"><span className="font-bebas text-5xl grad-text">${plan.price}</span><span className="text-gray-500">/mo</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-gray-400"><CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />{f}</li>)}
                </ul>
                <Link href="/pricing" className={`text-center py-3 rounded-full font-semibold text-sm transition-all ${plan.popular ? 'btn-red' : 'btn-ghost'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
              <h2 className="font-bebas text-5xl md:text-6xl tracking-wide mb-6">Ready to <span className="grad-text">Start?</span></h2>
              <p className="text-gray-500 leading-relaxed mb-10">Have questions about memberships, classes, or training programs? Our team is ready to help.</p>
              <div className="space-y-5">
                {[{ icon: MapPin, label: 'Location', value: '123 Fitness Street, Gym City' }, { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' }, { icon: Mail, label: 'Email', value: 'info@ironpeak.com' }].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#E8192C]/10 flex items-center justify-center text-[#E8192C] shrink-0"><Icon className="w-4 h-4" /></div>
                    <div><div className="text-xs text-gray-600 mb-0.5">{label}</div><div className="text-sm text-gray-300">{value}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-2xl p-8">
              {success && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm"><CheckCircle className="w-4 h-4" />Message sent! We'll get back to you within 24 hours.</div>}
              <form onSubmit={handleContact} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs text-gray-500 mb-1.5">Full Name</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="field" /></div>
                  <div><label className="block text-xs text-gray-500 mb-1.5">Email</label><input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="field" /></div>
                </div>
                <div><label className="block text-xs text-gray-500 mb-1.5">Message</label><textarea rows={5} required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us how we can help..." className="field resize-none" /></div>
                <button type="submit" disabled={submitting} className="btn-red w-full py-3 flex items-center justify-center gap-2">{submitting ? 'Sending...' : 'Send Message'}<ArrowRight className="w-4 h-4" /></button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}