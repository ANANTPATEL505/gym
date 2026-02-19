import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/bookings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const classId = searchParams.get('classId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (status && status !== 'All') where.status = status
    if (classId) where.classId = classId

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        gymClass: { select: { name: true, category: true } },
        member: { select: { name: true, email: true } },
        schedule: { select: { dayOfWeek: true, startTime: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json(bookings)
  } catch (err) {
    console.error('GET /api/bookings error:', err)
    return NextResponse.json({ error: 'Failed to fetch bookings', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

// POST /api/bookings
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { classId, memberId, guestName, guestEmail, guestPhone, scheduleId, date } = body

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 })
    }
    if (!memberId && (!guestName || !guestEmail)) {
      return NextResponse.json({ error: 'Either member ID or guest info is required' }, { status: 400 })
    }

    // Check if class exists
    const gymClass = await prisma.gymClass.findUnique({ where: { id: classId } })
    if (!gymClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Check spot availability
    if (scheduleId) {
      const existingBookings = await prisma.booking.count({
        where: { scheduleId, status: { in: ['CONFIRMED', 'WAITLISTED'] } },
      })
      if (existingBookings >= gymClass.maxSpots) {
        // Auto-waitlist
        const booking = await prisma.booking.create({
          data: {
            classId,
            memberId: memberId || null,
            guestName: guestName || null,
            guestEmail: guestEmail || null,
            guestPhone: guestPhone || null,
            scheduleId: scheduleId || null,
            date: date ? new Date(date) : new Date(),
            status: 'WAITLISTED',
          },
          include: { gymClass: { select: { name: true } } },
        })
        return NextResponse.json({ ...booking, waitlisted: true }, { status: 201 })
      }
    }

    const booking = await prisma.booking.create({
      data: {
        classId,
        memberId: memberId || null,
        guestName: guestName || null,
        guestEmail: guestEmail || null,
        guestPhone: guestPhone || null,
        scheduleId: scheduleId || null,
        date: date ? new Date(date) : new Date(),
        status: 'CONFIRMED',
      },
      include: { gymClass: { select: { name: true } } },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    console.error('POST /api/bookings error:', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}