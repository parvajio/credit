import { auth } from "@/auth";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const res = await db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        })

        if (!res) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(res)
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }
}