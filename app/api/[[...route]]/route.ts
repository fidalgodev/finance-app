import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";

import accounts from "./accounts";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// Handle errors
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }

  // Return a generic error
  return c.json({ error: "Internal server error" }, 500);
});

// Clerk middleware
app.use("*", clerkMiddleware());

const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
