import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [process.env.ALLOWED_ORIGINS || "http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

const port = 4000;
console.log(`Auth server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
