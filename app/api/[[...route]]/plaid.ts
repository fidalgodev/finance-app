import { getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { Hono } from "hono";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { connectedBanks } from "@/db/schema";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET_TOKEN,
    },
  },
});

const client = new PlaidApi(configuration);

const app = new Hono()
  .post("/create-link-token", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data } = await client.linkTokenCreate({
      user: {
        client_user_id: auth.userId,
      },
      client_name: "Finance App",
      products: [Products.Transactions],
      country_codes: [CountryCode.Gb],
      language: "en",
    });

    return c.json({ data: data.link_token });
  })
  .post(
    "/exchange-public-token",
    zValidator(
      "json",
      z.object({
        public_token: z.string(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { public_token } = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data } = await client.itemPublicTokenExchange({
        public_token,
      });

      // Save the access token to the database
      const [connectedBank] = await db
        .insert(connectedBanks)
        .values({
          id: createId(),
          userId: auth.userId,
          accessToken: data.access_token,
        })
        .returning();

      return c.json({ data });
    },
  );

export default app;
