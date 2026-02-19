import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Context = { params: Promise<{ id: string }> | { id: string } }

async function getId(context: Context) {
  const p = context.params
  return 'then' in p && typeof (p as Promise<{ id: string }>).then === 'function'
    ? (await p).id
    : (p as { id: string }).id
}

// PATCH /api/bookings/:id — update status
export async function PATCH(req: NextRequest, context: Context) {
  const id = await getId(context)
  try {
    const { status } = await req.json()
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: status as any },
    })
    return NextResponse.json(booking)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE /api/bookings/:id
export async function DELETE(_: NextRequest, context: Context) {
  const id = await getId(context)
  try {
    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}