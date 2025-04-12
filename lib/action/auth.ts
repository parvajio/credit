"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const signInWithCredentials = async (params: Pick<AuthCredentials, "email" | "password">) => {
  const { email, password } = params;
  try {
    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      return {
        success: false,
        error: result.error,
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Sign in failed" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { name, username, email, password } = params;

  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    await db.insert(users).values({
      name,
      username,
      email,
      password: hashedPassword,
      role: "USER", // Explicitly set role
      creditBalance: 25, // Initial credit balance
    });

    // Sign in the new user
    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Sign up failed" };
  }
};

export async function handleSignOut() {
  await signOut();
}