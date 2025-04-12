import { auth } from "@/auth"
import { db } from "@/database/db"
import { transactions, users } from "@/database/schema"
import { eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { status } = await req.json()

  try {
    // Start transaction
    await db.transaction(async (tx) => {
      // First get the transaction to ensure it exists and get the userId
      const [transaction] = await tx.select()
        .from(transactions)
        .where(eq(transactions.id, params.id))
        .limit(1)

      if (!transaction) {
        throw new Error("Transaction not found")
      }

      // Update transaction status
      await tx.update(transactions)
        .set({ 
          status,
          processedAt: new Date()
        })
        .where(eq(transactions.id, params.id))

      // If approved, update user's credit balance
      if (status === "APPROVED") {
        await tx.update(users)
          .set({
            creditBalance: sql`${users.creditBalance} + ${transaction.amount}`
          })
          .where(eq(users.id, transaction.userId!))
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Transaction update error:", error)
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    )
  }
}