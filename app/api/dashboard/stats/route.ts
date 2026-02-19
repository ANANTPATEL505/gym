import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const PLAN_PRICES: Record<string, number> = { STARTER: 29, PRO: 59, ELITE: 99 }

export async function GET() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      totalMembers,
      activeMembers,
      totalBookings,
      todayBookings,
      totalClasses,
      totalTrainers,
      totalContacts,
      unreadContacts,
      recentBookings,
      membersByPlan,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.gymClass.count(),
      prisma.trainer.count(),
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'UNREAD' } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          gymClass: { select: { name: true, category: true } },
          member: { select: { name: true, email: true } },
          schedule: { select: { dayOfWeek: true, startTime: true } },
        },
      }),
      prisma.member.groupBy({
        by: ['plan'],
        _count: { plan: true },
      }),
    ])

    // Revenue calculation
    const revenue = { starter: 0, pro: 0, elite: 0, total: 0 }
    for (const group of membersByPlan) {
      const plan = group.plan.toLowerCase() as 'starter' | 'pro' | 'elite'
      const price = PLAN_PRICES[group.plan] ?? 0
      const amount = price * group._count.plan
      if (plan in revenue) (revenue as any)[plan] = amount
      revenue.total += amount
    }

    return NextResponse.json({
      totalMembers,
      activeMembers,
      totalBookings,
      todayBookings,
      totalClasses,
      totalTrainers,
      totalContacts,
      unreadContacts,
      revenue,
      recentBookings,
      membersByPlan,
    })
  } catch (err) {
    console.error('GET /api/dashboard/stats error:', err)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}