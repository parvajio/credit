import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const ROLE_UNUM = pgEnum("role", ["USER", "ADMIN"]);
export const STATUS_UNUM = pgEnum("status", ["PENDING", "APPROVED", "REJECTED"]);

export const users = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: ROLE_UNUM("role").default("USER"),
    creditBalance: integer("credit_balance").default(25),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()

})

export const transactions = pgTable("transactions", {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    amount: integer("amount").notNull(),
    status: STATUS_UNUM("status").default("PENDING"),
    createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
    processedAt: timestamp("processed_at", {withTimezone: true}),
    description: text("description")
  });