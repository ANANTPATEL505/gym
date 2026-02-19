'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dumbbell, Menu, X, ChevronDown } from 'lucide-react'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Classes', href: '/classes' },
  { label: 'Trainers', href: '/trainers' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Pricing', href: '/pricing' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#080808]/95 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Dumbbell className="w-7 h-7 text-[#E8192C] animate-spin-slow" />
          </div>
          <span className="font-bebas text-2xl tracking-widest grad-text">IRONPEAK</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-white bg-white/6'
                    : 'text-gray-400 hover:text-white hover:bg-white/4'
                }`}
              >
                {l.label}
                {active && (
                  <span className="block h-[2px] bg-gradient-to-r from-[#E8192C] to-[#FF5722] rounded-full mt-0.5 mx-auto" style={{ width: '60%' }} />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
          >
            Admin
          </Link>
          <Link href="/pricing" className="btn-red text-sm py-2 px-5">
            Join Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-400 hover:text-white"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0e0e0e] border-t border-white/5 py-4 px-4 space-y-1 animate-slideDown">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href ? 'text-white bg-white/6' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-3 text-sm text-gray-400">Admin Dashboard</Link>
            <Link href="/pricing" onClick={() => setOpen(false)} className="btn-red text-center text-sm">Join Now</Link>
          </div>
        </div>
      )}
    </nav>
  )
}