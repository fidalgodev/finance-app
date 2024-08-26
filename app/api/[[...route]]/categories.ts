import { db } from "@/db/drizzle";
import { insertCategorySchema } from "@/db/schema";
import { categories } from "@/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono()

  // Categories list
  .get("/", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, auth.userId));

    return c.json({ data });
  })

  // Single category
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
          res: c.json({ error: "Invalid category id" }, 400),
        });
      }

      const [data] = await db
        .select({
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)));

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Category not found" }, 404),
        });
      }

      return c.json({ data });
    },
  )

  // Insert category
  .post("/", zValidator("json", insertCategorySchema), async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    // Insert the category
    const [data] = await db
      .insert(categories)
      .values({
        id: createId(),
        userId: auth.userId,
        ...values,
      })
      .returning();

    return c.json({ data });
  })

  // Bulk delete categories
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

      // Delete the categories
      const data = await db
        .delete(categories)
        .where(
          and(eq(categories.userId, auth.userId), inArray(categories.id, ids)),
        )
        .returning({
          ids: categories.id,
        });

      return c.json({ data });
    },
  )

  // Update category
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator("json", insertCategorySchema),
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
          res: c.json({ error: "Invalid category id" }, 400),
        });
      }

      // Update the category
      const [data] = await db
        .update(categories)
        .set(values)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Category not found" }, 404),
        });
      }

      return c.json({ data });
    },
  )

  // Delete category
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
          res: c.json({ error: "Invalid category id" }, 400),
        });
      }

      // Delete the category
      const [data] = await db
        .delete(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

      if (!data) {
        throw new HTTPException(404, {
          res: c.json({ error: "Category not found" }, 404),
        });
      }

      return c.json({ data });
    },
  );

export default app;
