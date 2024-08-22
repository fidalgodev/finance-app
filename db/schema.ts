import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
});

// Schema for inserting a new account
export const insertAccountSchema = createInsertSchema(accounts).pick({
  name: true,
});

// Schema for selection an account
export const selectAccountSchema = createSelectSchema(accounts);
