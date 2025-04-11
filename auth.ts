import NextAuth, { User } from "next-auth"
import CredentialsContainer from "next-auth/providers/credentials"
import { db } from "./database/db";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 2 },
    providers: [
        CredentialsContainer({
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await db.select().from(users).where(eq(users.email, credentials.email.toString())).limit(1);

                if (!user[0]) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password.toString(), user[0].password)

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user[0].id.toString(),
                    email: user[0].email,
                    name: user[0].name,
                    username: user[0].username,
                    role: user[0].role,
                    creditBalance: user[0].creditBalance,

                } as User;
            }
        })
    ],
    pages: {
        signIn: "/log-in"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.role = user.role as "ADMIN" | "USER";
                token.creditBalance = user.creditBalance as number;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.role = token.role as "USER" | "ADMIN";
                session.user.creditBalance = token.creditBalance as number;
            }
            return session
        }
    }
})