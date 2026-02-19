import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/trainers
export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        _count: { select: { classes: true } },
      },
      orderBy: { rating: 'desc' },
    })
    return NextResponse.json(trainers)
  } catch (err) {
    console.error('GET /api/trainers error:', err)
    return NextResponse.json({ error: 'Failed to fetch trainers', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

// POST /api/trainers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, specialty, bio, image, experience, rating } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const trainer = await prisma.trainer.create({
      data: {
        name,
        email,
        phone: phone || null,
        specialty: specialty || [],
        bio: bio || null,
        image: image || null,
        experience: experience ?? 1,
        rating: rating ?? 5.0,
      },
    })
    return NextResponse.json(trainer, { status: 201 })
  } catch (err) {
    console.error('POST /api/trainers error:', err)
    return NextResponse.json({ error: 'Failed to create trainer' }, { status: 500 })
  }
}