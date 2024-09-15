import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

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

const app = new Hono().post("/create-link-token", async (c) => {
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
});

export default app;
