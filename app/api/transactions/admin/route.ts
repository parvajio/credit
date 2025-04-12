import { auth } from "@/auth";
import { db } from "@/database/db";
import { transactions, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await auth();

    if(!session?.user?.role || session?.user?.role !== "ADMIN"){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        const tx = await db.select({
            id: transactions.id,
            amount: transactions.amount,
            status: transactions.status,
            createdAt: transactions.createdAt,
            processedAt: transactions.processedAt,
            description: transactions.description,
            userId: transactions.userId,
            userName: users.name,
            userEmail: users.email
          })
          .from(transactions)
          .leftJoin(users, eq(transactions.userId, users.id))
          .orderBy(desc(transactions.createdAt));
        
        return NextResponse.json(tx)
    } catch (error) {
        console.log(error)
        return NextResponse.json({errro: "Failed to fetch transactions"}, {status: 500})
    }
}