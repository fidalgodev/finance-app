import { z } from "zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { insertAccountSchema } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { eq, and, inArray } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
  .post("/", zValidator("json", insertAccountSchema), async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    // Insert the account
    const [data] = await db
      .insert(accounts)
      .values({
        id: createId(),
        userId: auth.userId,
        ...values,
      })
      .returning();

    return c.json({ data });
  })
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

      // Delete the accounts
      const data = await db
        .delete(accounts)
        .where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, ids)))
        .returning({
          ids: accounts.id,
        });

      return c.json({ data });
    },
  );

export default app;
