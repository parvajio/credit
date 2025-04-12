import { auth } from "@/auth";
import { db } from "@/database/db";
import { transactions, users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } } 
req: NextRequest,
  {params}:{ params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await req.json();

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    // 1. First get the transaction
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, (await params).id))
      .limit(1);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // 2. Update transaction status
    await db
      .update(transactions)
      .set({
        status,
        processedAt: new Date(),
      })
      .where(eq(transactions.id, (await params).id));

    // 3. Update user balance if approved
    if (status === "APPROVED") {
      await db
        .update(users)
        .set({
          creditBalance: sql`${users.creditBalance} + ${transaction.amount}`,
        })
        .where(eq(users.id, transaction.userId!));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Transaction update error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}