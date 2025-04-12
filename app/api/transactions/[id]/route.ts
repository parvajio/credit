// app/api/transactions/[id]/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/database/db'
import { transactions, users } from '@/database/schema'
import { eq, sql } from 'drizzle-orm'

interface RouteContext {
  params: {
    id: string
  }
}


export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()

    // Validate status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    await db.transaction(async (tx) => {
      // Get transaction first
      const [transaction] = await tx
        .select()
        .from(transactions)
        .where(eq(transactions.id, context.params.id))
        .limit(1)

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      // Update transaction
      await tx
        .update(transactions)
        .set({
          status,
          processedAt: new Date(),
        })
        .where(eq(transactions.id, context.params.id))

      // Update user balance if approved
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
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}