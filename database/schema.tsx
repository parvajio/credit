import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const ROLE_UNUM = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: ROLE_UNUM("role").default("USER"),
    creditBalance: integer("credit_balance").default(25),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()

})