'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Dumbbell, LayoutDashboard, Users, Calendar,
  BookOpen, MessageSquare, Settings, LogOut, ChevronRight, UserCheck
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard',  href: '/dashboard',           icon: LayoutDashboard },
  { label: 'Members',    href: '/members',              icon: Users },
  { label: 'Classes',    href: '/dashboard/classes',    icon: Dumbbell },
  { label: 'Trainers',   href: '/dashboard/trainers',   icon: UserCheck },
  { label: 'Bookings',   href: '/dashboard/bookings',   icon: Calendar },
  { label: 'Inquiries',  href: '/dashboard/inquiries',  icon: MessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-[#E8192C]" />
          <span className="font-bebas text-xl tracking-widest grad-text">IRONPEAK</span>
        </Link>
        <div className="mt-1 text-xs text-gray-600 pl-8">Admin Panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs text-gray-700 font-semibold uppercase tracking-wider px-3 mb-3">Management</div>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon className="w-4 h-4" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-[#E8192C]" />}
            </Link>
          )
        })}

        <div className="text-xs text-gray-700 font-semibold uppercase tracking-wider px-3 mb-3 mt-6">Site</div>
        <Link href="/" className="sidebar-link">
          <BookOpen className="w-4 h-4" />
          View Website
        </Link>
        <Link href="/dashboard/settings" className="sidebar-link">
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8192C] to-[#FF5722] flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Admin User</div>
            <div className="text-xs text-gray-600 truncate">admin@ironpeak.com</div>
          </div>
          <LogOut className="w-3.5 h-3.5 text-gray-600 hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  )
}