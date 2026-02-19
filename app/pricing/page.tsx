'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle, X, Zap, ArrowRight, HelpCircle } from 'lucide-react'

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: { monthly: 29, annual: 23 },
    tagline: 'Everything you need to get started',
    features: [
      { text: 'Full gym floor access', included: true },
      { text: 'Basic equipment usage', included: true },
      { text: 'Locker room & showers', included: true },
      { text: '2 guest passes per month', included: true },
      { text: 'App workout tracking', included: true },
      { text: 'Group fitness classes', included: false },
      { text: 'Personal training sessions', included: false },
      { text: 'Nutrition consultation', included: false },
      { text: 'Recovery suite access', included: false },
      { text: 'Priority booking', included: false },
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: { monthly: 59, annual: 47 },
    tagline: 'Most popular for serious fitness goals',
    popular: true,
    features: [
      { text: 'Full gym floor access', included: true },
      { text: 'All equipment usage', included: true },
      { text: 'Locker room & showers', included: true },
      { text: '4 guest passes per month', included: true },
      { text: 'App workout tracking', included: true },
      { text: 'Unlimited group classes', included: true },
      { text: 'Personal training 2×/month', included: true },
      { text: 'Nutrition consultation', included: true },
      { text: 'Recovery suite access', included: false },
      { text: 'Priority booking', included: false },
    ],
  },
  {
    id: 'ELITE',
    name: 'Elite',
    price: { monthly: 99, annual: 79 },
    tagline: 'For athletes who demand the best',
    features: [
      { text: 'Full gym floor access', included: true },
      { text: 'All equipment usage', included: true },
      { text: 'Locker room & showers', included: true },
      { text: 'Unlimited guest passes', included: true },
      { text: 'App workout tracking', included: true },
      { text: 'Unlimited group classes', included: true },
      { text: 'Unlimited personal training', included: true },
      { text: 'Nutrition & supplement guidance', included: true },
      { text: 'Recovery suite & sauna access', included: true },
      { text: 'Priority class booking', included: true },
    ],
  },
]

const FAQS = [
  { q: 'Is there a joining fee?', a: 'No joining fees, ever. The price you see is the price you pay.' },
  { q: 'Can I cancel anytime?', a: 'Yes. All plans are month-to-month with no long-term contracts. Cancel with 30 days notice.' },
  { q: 'What\'s included in the free trial?', a: 'Your free 7-day trial gives you full access to all features of your chosen plan, no credit card required.' },
  { q: 'Can I upgrade or downgrade?', a: 'Absolutely. You can change your plan at any time and the new rate takes effect on your next billing date.' },
  { q: 'Are there family or corporate discounts?', a: 'Yes! Contact our team for family plans (3+ members) and corporate wellness packages with significant savings.' },
]

type Plan = typeof PLANS[0]
type SignupForm = { name: string; email: string; phone: string; plan: string }

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', phone: '', plan: '' })
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setForm(f => ({ ...f, plan: plan.id }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.plan) {
      alert('Please select a plan first.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          plan: form.plan,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Signup failed')
      }
      setSuccess(true)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />

      {/* Hero */}
      <div className="pt-32 pb-12 px-4 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8192C]/6 rounded-full blur-[100px] pointer-events-none" />
        <p className="text-[#E8192C] text-sm font-semibold tracking-widest uppercase mb-3">Membership</p>
        <h1 className="font-bebas text-6xl md:text-8xl tracking-wide mb-4">
          Simple <span className="grad-text">Pricing</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto mb-8">
          No hidden fees, no contracts. Start your free 7-day trial on any plan today.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-[#111] border border-white/5 rounded-full p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('annual')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Annual
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">-20%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 cursor-pointer ${
                plan.popular
                  ? 'bg-gradient-to-br from-[#1a0608] to-[#0d0d0d] border-2 border-[#E8192C]/50 red-glow-sm'
                  : 'bg-[#111] border border-white/5 hover:border-white/10'
              }`}
              onClick={() => handleSelect(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-[#E8192C] to-[#FF5722] rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-bebas text-3xl tracking-wide mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6">{plan.tagline}</p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-bebas text-6xl grad-text">${plan.price[billing]}</span>
                <div className="text-gray-500 text-sm">
                  <div>/month</div>
                  {billing === 'annual' && <div className="text-green-400 text-xs">billed annually</div>}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${f.included ? 'text-gray-300' : 'text-gray-600'}`}>
                    {f.included
                      ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      : <X className="w-4 h-4 text-gray-700 shrink-0" />
                    }
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(plan)}
                className={`py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular ? 'btn-red' : 'btn-ghost hover:border-[#E8192C]/50 hover:text-[#E8192C]'
                }`}
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
          {['7-Day Free Trial', 'No Credit Card Required', 'Cancel Anytime', 'Instant Access'].map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[#0a0a0a] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-bebas text-4xl md:text-5xl tracking-wide text-center mb-12">
            Frequently Asked <span className="grad-text">Questions</span>
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/2 transition-colors"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 shrink-0 transition-colors ${expandedFaq === i ? 'text-[#E8192C]' : 'text-gray-600'}`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeInUp">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-8 relative">
            <button onClick={() => { setSelectedPlan(null); setSuccess(false) }} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-bebas text-3xl tracking-wide mb-2">Welcome to IronPeak!</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Your <span className="text-white font-semibold">{selectedPlan.name}</span> membership has been created.
                </p>
                <p className="text-gray-600 text-xs">Check your email for access details and next steps.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-bebas text-2xl tracking-wide mb-1">Start {selectedPlan.name} Plan</h3>
                  <p className="text-gray-500 text-sm">
                    7-day free trial · then ${selectedPlan.price.monthly}/mo
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
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
                  <div className="p-4 bg-[#E8192C]/8 border border-[#E8192C]/15 rounded-xl text-sm text-gray-400">
                    <div className="font-semibold text-white mb-1">{selectedPlan.name} Plan selected</div>
                    7-day free trial • No credit card required • Cancel anytime
                  </div>
                  <button type="submit" disabled={submitting} className="btn-red w-full py-3 flex items-center justify-center gap-2">
                    {submitting ? 'Creating Account...' : 'Claim Free Trial'}
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