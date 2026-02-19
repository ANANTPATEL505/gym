import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/membership/verify
 * Body: { email: string }
 * Returns: { valid: boolean, member?: { name, plan, status } }
 *
 * Security gate: only ACTIVE members can book classes.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ valid: false, error: 'Email is required' }, { status: 400 })
    }

    const member = await prisma.member.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, plan: true, status: true, expiresAt: true },
    })

    if (!member) {
      return NextResponse.json({
        valid: false,
        error: 'No membership found for this email. Please purchase a membership first.',
      })
    }

    if (member.status !== 'ACTIVE') {
      return NextResponse.json({
        valid: false,
        error: `Your membership is ${member.status.toLowerCase()}. Please contact us to reactivate.`,
      })
    }

    // Check expiry if set
    if (member.expiresAt && new Date(member.expiresAt) < new Date()) {
      // Auto-mark as expired
      await prisma.member.update({ where: { id: member.id }, data: { status: 'INACTIVE' } })
      return NextResponse.json({
        valid: false,
        error: 'Your membership has expired. Please renew to book classes.',
      })
    }

    return NextResponse.json({
      valid: true,
      member: { id: member.id, name: member.name, plan: member.plan, status: member.status },
    })
  } catch (err) {
    console.error('POST /api/membership/verify error:', err)
    return NextResponse.json({ valid: false, error: 'Verification failed. Please try again.' }, { status: 500 })
  }
}