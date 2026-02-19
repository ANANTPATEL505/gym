import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/members
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const plan = searchParams.get('plan')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (plan && plan !== 'All') where.plan = plan
    if (status && status !== 'All') where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const members = await prisma.member.findMany({
      where,
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(members)
  } catch (err) {
    console.error('GET /api/members error:', err)
    return NextResponse.json({ error: 'Failed to fetch members', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

// POST /api/members
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, plan = 'STARTER' } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const existing = await prisma.member.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone: phone || null,
        plan: plan as any,
        expiresAt,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (err) {
    console.error('POST /api/members error:', err)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}