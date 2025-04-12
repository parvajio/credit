import { auth } from "@/auth"
import { db } from "@/database/db"
import { transactions, users } from "@/database/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

// POST: Create transaction
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { amount, description } = await req.json()

  try {
    const tx = await db.insert(transactions).values({
      userId: session.user.id,
      amount,
      description,
      status: "PENDING"
    }).returning()

    return NextResponse.json(tx[0])
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}

// GET: List transactions
export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const isAdmin = session.user.role === "ADMIN"
    
    const txs = isAdmin
      ? await db.query.transactions.findMany({
          with: {
            user: {
              columns: {
                name: true,
                email: true
              }
            }
          }
        })
      : await db.query.transactions.findMany({
          where: eq(transactions.userId, session.user.id)
        })

    return NextResponse.json(txs)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}