import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Context = { params: Promise<{ id: string }> | { id: string } }

async function getId(context: Context) {
  const p = context.params
  return 'then' in p && typeof (p as Promise<{ id: string }>).then === 'function'
    ? (await p).id
    : (p as { id: string }).id
}

// GET /api/members/:id
export async function GET(_: NextRequest, context: Context) {
  const id = await getId(context)
  try {
    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        bookings: {
          include: { gymClass: true, schedule: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { bookings: true } },
      },
    })
    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    return NextResponse.json(member)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 })
  }
}

// PUT /api/members/:id
export async function PUT(req: NextRequest, context: Context) {
  const id = await getId(context)
  try {
    const body = await req.json()
    const { name, email, phone, plan, status } = body

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        phone: phone || null,
        ...(plan && { plan: plan as any }),
        ...(status && { status: status as any }),
      },
    })
    return NextResponse.json(member)
  } catch (err) {
    console.error('PUT /api/members error:', err)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}

// DELETE /api/members/:id
export async function DELETE(_: NextRequest, context: Context) {
  const id = await getId(context)
  try {
    await prisma.booking.deleteMany({ where: { memberId: id } })
    await prisma.member.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/members error:', err)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}