import { getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { accounts, categories, insertTransactionSchema } from "@/db/schema";
import { transactions } from "@/db/schema";

const app = new Hono()

  // Transactions list
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        accountId: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { accountId, from, to } = c.req.valid("query");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      // Default to the last 30 days
      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const data = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        // Inner join with accounts, every transaction belongs to an account
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))

        // Left join with categories, transactions can have a category or not
        .leftJoin(categories, eq(transactions.categoryId, categories.id))

        // Filter by the following conditions
        .where(
          and(
            // If account id is provided, filter by it, otherwise get all transactions
            accountId ? eq(transactions.accountId, accountId) : undefined,

            // Grab only transactions that belong to the user
            eq(accounts.userId, auth.userId),

            // Filter by date range
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ),
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    },
  )

  // Single transaction
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid transaction id" }, 400),
        });
      }

      const [data] = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          amount: transactions.amount,
          notes: transactions.notes,
          account: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)

        // Inner join with accounts, every transaction belongs to an account
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))

        // Left join with categories, transactions can have a category or not
        .leftJoin(categories, eq(transactions.categoryId, categories.id))

        // Filter by the following conditions
        .where(
          and(
            eq(transactions.id, id),

            // Grab only transactions that belong to the user
            eq(accounts.userId, auth.userId),
          ),
        );

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Transaction not found" }, 404),
        });
      }

      return c.json({ data });
    },
  )

  // Insert transaction
  .post("/", zValidator("json", insertTransactionSchema), async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    // Insert the transaction
    // TODO: Make sure the accountId passed in belongs to the user

    // Test throw error
    // TODO: See if we can make useMutation work without throwing an error in the useMutation hook
    // Keep this to test the error handling

    const [data] = await db
      .insert(transactions)
      .values({
        id: createId(),
        ...values,
      })
      .returning();

    return c.json({ data });
  })

  // Bulk insert transactions
  .post(
    "/bulk-create",
    zValidator("json", z.array(insertTransactionSchema)),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      // Insert the transactions
      // TODO: Make sure the accountId passed in belongs to the user
      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          })),
        )
        .returning();

      return c.json({ data });
    },
  )

  // Bulk delete transactions
  .post(
    "/bulk-delete",
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
      const auth = getAuth(c);
      const { ids } = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      // Delete the transactions
      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)

          // Inner join with accounts to make sure the transaction belongs to the user
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))

          // Filter by the following conditions
          .where(
            and(
              inArray(transactions.id, ids),
              eq(accounts.userId, auth.userId),
            ),
          ),
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          // Only delete transactions that are in the transactionsToDelete CTE
          // This is to make sure the transactions belong to the user and are valid
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`,
          ),
        )
        .returning({
          id: transactions.id,
        });

      return c.json({ data });
    },
  )

  // Update transaction
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator("json", insertTransactionSchema),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid transaction id" }, 400),
        });
      }

      // Update the category
      const transactionToUpdate = db.$with("transaction_to_update").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)

          // Inner join with accounts to make sure the transaction belongs to the user
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))

          // Filter by the following conditions
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))

          // Only grab one transaction
          // TODO: Is this needed?
          .limit(1),
      );

      const [data] = await db
        .with(transactionToUpdate)
        .update(transactions)
        .set(values)
        .where(
          // Only update the transaction that is in the transactionToUpdate CTE
          // This is to make sure the transaction belongs to the user and is valid
          eq(transactions.id, sql`(select id from ${transactionToUpdate})`),
        )
        .returning();

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Category not found" }, 404),
        });
      }

      return c.json({ data });
    },
  )

  // Delete transaction
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      if (!id) {
        throw new HTTPException(400, {
          res: c.json({ error: "Invalid transaction id" }, 400),
        });
      }

      // Delete the transaction
      const transactionToDelete = db.$with("transaction_to_delete").as(
        db
          .select({
            id: transactions.id,
          })
          .from(transactions)

          // Inner join with accounts to make sure the transaction belongs to the user
          .innerJoin(accounts, eq(transactions.accountId, accounts.id))

          // Filter by the following conditions
          .where(and(eq(transactions.id, id), eq(accounts.userId, auth.userId)))

          // Only grab one transaction
          // TODO: Is this needed?
          .limit(1),
      );

      const [data] = await db
        .with(transactionToDelete)
        .delete(transactions)
        .where(
          // Only delete the transaction that is in the transactionToDelete CTE
          // This is to make sure the transaction belongs to the user and is valid
          eq(transactions.id, sql`(select id from ${transactionToDelete})`),
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Transaction not found" }, 404),
        });
      }

      return c.json({ data });
    },
  );

export default app;
