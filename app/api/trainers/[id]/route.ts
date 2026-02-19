import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: params.id },
      include: { classes: true, _count: { select: { classes: true } } },
    })
    if (!trainer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(trainer)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trainer' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const trainer = await prisma.trainer.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        phone: body.phone || null,
        ...(body.specialty && { specialty: body.specialty }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.experience !== undefined && { experience: Number(body.experience) }),
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
      },
    })
    return NextResponse.json(trainer)
  } catch {
    return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.gymClass.deleteMany({ where: { trainerId: params.id } })
    await prisma.trainer.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete trainer' }, { status: 500 })
  }
}