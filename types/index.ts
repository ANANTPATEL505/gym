export type NavItem = {
  label: string
  href: string
  icon?: React.ReactNode
}

export type StatsCard = {
  label: string
  value: string | number
  change?: string
  positive?: boolean
  icon: React.ReactNode
}

export type MemberWithBookings = {
  id: string
  name: string
  email: string
  phone?: string | null
  plan: string
  status: string
  joinedAt: Date
  expiresAt?: Date | null
  _count?: { bookings: number }
}

export type ClassWithTrainer = {
  id: string
  name: string
  description?: string | null
  maxSpots: number
  duration: number
  category: string
  image?: string | null
  trainer: {
    id: string
    name: string
    image?: string | null
  }
  _count?: { bookings: number }
  schedules?: ScheduleItem[]
}

export type ScheduleItem = {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
  classId: string
  gymClass?: {
    name: string
    category: string
    trainer: { name: string }
    duration: number
  }
}

export type TrainerWithClasses = {
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

export type BookingWithDetails = {
  id: string
  date: Date
  status: string
  guestName?: string | null
  guestEmail?: string | null
  member?: { name: string; email: string } | null
  gymClass: { name: string; category: string }
  schedule?: { dayOfWeek: number; startTime: string } | null
  createdAt: Date
}

export type DashboardStats = {
  totalMembers: number
  activeMembers: number
  totalBookings: number
  todayBookings: number
  totalClasses: number
  totalTrainers: number
  totalContacts: number
  unreadContacts: number
  revenue: { starter: number; pro: number; elite: number; total: number }
  recentBookings: BookingWithDetails[]
  membersByPlan: { plan: string; _count: { plan: number } }[]
}