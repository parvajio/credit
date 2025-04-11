"use server";

import { signIn } from "@/auth";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq, Param } from "drizzle-orm";

export const signInWithCredentioals = async (Params: Pick<AuthCredentials, "email" | "password">) => {
    const { email, password } = Params;
    try {
        const result = await signIn("credentials", { email, password, redirect: false })

        if (result?.error) {
            return {
                success: false,
                error: result.error,
            }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: "Sign in failed" }
    }
}

export const signUp = async (Params: AuthCredentials) => {
    const { name, username, email, password } = Params;

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user[0]) {
        return { success: false, error: "User already exists" }
    }

    const hashedPassword = await hash(password, 10);


    try {
        await db.insert(users).values({
            name,
            username,
            email,
            password: hashedPassword
        });

        await signInWithCredentioals({email, password});

        return { success: true};

    } catch (error) {
        return { success: false, error: "Sign up failed" }
    }
}