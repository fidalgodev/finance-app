import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { access } from "fs";
import { z } from "zod";

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  plaidId: text("plaid_id"),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

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

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

// Schema for inserting a new category, only fields that are allowed to be inserted via the API are picked
export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

// Schema for inserting a new transaction, only fields that are allowed to be inserted via the API are picked
export const insertTransactionSchema = createInsertSchema(transactions, {
  // Date will be coerced to a Date object from a string when validating
  date: z.coerce.date(),
}).omit({
  id: true,
});

export const connectedBanks = pgTable("connected_banks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accessToken: text("access_token").notNull(),
});
