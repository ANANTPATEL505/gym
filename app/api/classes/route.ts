import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/classes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    const classes = await prisma.gymClass.findMany({
      where: category && category !== 'All' ? { category: category as any } : undefined,
      include: {
        trainer: { select: { id: true, name: true, image: true } },
        schedules: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(classes)
  } catch (err) {
    console.error('GET /api/classes error:', err)
    return NextResponse.json({ error: 'Failed to fetch classes', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

// POST /api/classes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, trainerId, maxSpots, duration, category, image } = body

    if (!name || !trainerId) {
      return NextResponse.json({ error: 'Name and trainer are required' }, { status: 400 })
    }

    const gymClass = await prisma.gymClass.create({
      data: {
        name,
        description: description || null,
        trainerId,
        maxSpots: maxSpots ?? 20,
        duration: duration ?? 60,
        category: category as any ?? 'STRENGTH',
        image: image || null,
      },
      include: { trainer: { select: { name: true } } },
    })

    return NextResponse.json(gymClass, { status: 201 })
  } catch (err) {
    console.error('POST /api/classes error:', err)
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 })
  }
}