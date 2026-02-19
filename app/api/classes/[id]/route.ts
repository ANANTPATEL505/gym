import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const gymClass = await prisma.gymClass.findUnique({
      where: { id: params.id },
      include: { trainer: true, schedules: true, _count: { select: { bookings: true } } },
    })
    if (!gymClass) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(gymClass)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const gymClass = await prisma.gymClass.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.trainerId && { trainerId: body.trainerId }),
        ...(body.maxSpots !== undefined && { maxSpots: Number(body.maxSpots) }),
        ...(body.duration !== undefined && { duration: Number(body.duration) }),
        ...(body.category && { category: body.category }),
        ...(body.image !== undefined && { image: body.image }),
      },
      include: { trainer: { select: { name: true } } },
    })
    return NextResponse.json(gymClass)
  } catch {
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.booking.deleteMany({ where: { classId: params.id } })
    await prisma.schedule.deleteMany({ where: { classId: params.id } })
    await prisma.gymClass.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete class' }, { status: 500 })
  }
}