// app/api/transactions/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/database/db'
import { transactions, users } from '@/database/schema'
import { eq, sql } from 'drizzle-orm'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Request validation
    const { status } = await request.json()
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Database transaction
    await db.transaction(async (tx) => {
      const [transaction] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, params.id))
        .limit(1)

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      await tx
        .update(transactions)
        .set({
          status,
          processedAt: new Date(),
        })
        .where(eq(transactions.id, params.id))

      if (status === 'APPROVED') {
        await tx
          .update(users)
          .set({
            creditBalance: sql`${users.creditBalance} + ${transaction.amount}`,
          })
          .where(eq(users.id, transaction.userId!))
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Transaction update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}