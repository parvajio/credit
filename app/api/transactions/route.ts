import { auth } from "@/auth";
import { db } from "@/database/db";
import { transactions } from "@/database/schema";
import { eq } from "drizzle-orm";

// POST: Create transaction
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const { amount, description } = await req.json();

    const tx = await db.insert(transactions).values({
        userId: session.user.id,
        amount,
        description,
        status: "PENDING"
    }).returning();

    return Response.json(tx[0]);
}

// GET: List transactions (for admin/user)
export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const isAdmin = session.user.role === "ADMIN";
    const whereClause = isAdmin
        ? {}
        : { userId: session.user.id };

    const txs = await db.select().from(transactions)
        .where(isAdmin ? undefined : eq(transactions.userId, session.user.id));
    return Response.json(txs);
}