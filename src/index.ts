import { Hono } from "hono";
import boards from "./boards";

const app = new Hono();

app.get("/:board/:company", async (ctx) => {
  const board = ctx.req.param("board");
  const company = ctx.req.param("company");
  const getJobs = boards[board];
  if (!getJobs) return ctx.text("Job board not supported", 400);
  try {
    const jobs = await getJobs(company);
    jobs.sort((a, b) => a.title.localeCompare(b.title));
    return ctx.json(jobs);
  } catch (err) {
    return ctx.text(err.message, 500);
  }
});

app.all("*", (ctx) =>
  ctx.text(
    "Thanks for dropping by! Visit https://github.com/plibither8/jobber for more info ;)"
  )
);

export default app;
