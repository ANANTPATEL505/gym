import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/contact
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const contacts = await prisma.contact.findMany({
      where: status && status !== 'All' ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(contacts)
  } catch (err) {
    console.error('GET /api/contact error:', err)
    return NextResponse.json({ error: 'Failed to fetch contacts', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

// POST /api/contact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: { name, email, phone: phone || null, message },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (err) {
    console.error('POST /api/contact error:', err)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}