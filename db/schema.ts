import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  plaidId: text("plaid_id"),
});

// Schema for inserting a new account, only fields that are allowed to be inserted via the API are picked
export const insertAccountSchema = createInsertSchema(accounts).pick({
  name: true,
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  plaidId: text("plaid_id"),
  name: text("name").notNull(),
});

// Schema for inserting a new category, only fields that are allowed to be inserted via the API are picked
export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});
