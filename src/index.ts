import { Hono } from "hono";

interface Env {}

const app = new Hono<{ Bindings: Env }>();

app.all("*", (ctx) =>
  ctx.text(
    "Thanks for dropping by! Visit https://github.com/plibither8/workers-bun-hono-template for more info ;)"
  )
);

export default app;
