import { auth } from "@/auth";
import { db } from "@/database/db";
import { transactions, users } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // note: params is a Promise
) {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await req.json()

    try {
        await db.transaction(async (tx) => {
            await tx.update(transactions)
                .set({
                    status,
                    processedAt: new Date()
                })
                .where(eq(transactions.id, (await context.params).id))

            if (status == "APPROVED") {
                const transaction = await tx.query.transactions.findFirst({
                    where: eq(transactions.id, (await context.params).id)
                })
                if (transaction) {
                    await tx.update(users)
                    .set({
                        creditBalance: sql`${users.creditBalance} + ${transaction.amount}`
                    })
                    .where(eq(users.id, transaction.userId!))
                }
            }

        })

        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json({error: "Failed to update transaction"}, {status: 500})
    }
}

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const session = await auth()
//   if (!session?.user?.id || session.user.role !== "ADMIN") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const { status } = await req.json()

//   try {
//     // Start transaction
//     await db.transaction(async (tx) => {
//       // Update transaction status
//       await tx.update(transactions)
//         .set({
//           status,
//           processedAt: new Date()
//         })
//         .where(eq(transactions.id, params.id))

//       // If approved, update user's credit balance
//       if (status === "APPROVED") {
//         const transaction = await tx.query.transactions.findFirst({
//           where: eq(transactions.id, params.id)
//         })

//         if (transaction) {
//           await tx.update(users)
//             .set({
//               creditBalance: db.sql`${users.creditBalance} + ${transaction.amount}`
//             })
//             .where(eq(users.id, transaction.userId))
//         }
//       }
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update transaction" },
//       { status: 500 }
//     )
//   }
// }
