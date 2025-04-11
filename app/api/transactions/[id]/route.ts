import { db } from "@/database/db";
import { transactions } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { status } = await req.json();
    // Verify admin role here
    await db.update(transactions)
      .set({ status, processedAt: new Date() })
      .where(eq(transactions.id, params.id));
  }