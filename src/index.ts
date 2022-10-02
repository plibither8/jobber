import { Hono } from "hono";
import { HTMLElement, parse } from "node-html-parser";

interface Env {}

const app = new Hono<{ Bindings: Env }>();

interface Job {
  title: string;
  location: string;
  link: string;
}

const boards: Record<string, (company: string) => Promise<Job[]>> = {
  ashby: async (company) => {
    interface AshbyResponse {
      data: {
        jobBoard: {
          jobPostings: {
            id: string;
            title: string;
            locationName: string;
            employmentType: string;
            secondaryLocations: { locationName: string }[];
          }[];
        };
      };
    }
    const url =
      "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams";
    const body = {
      operationName: "ApiJobBoardWithTeams",
      variables: {
        organizationHostedJobsPageName: company,
      },
      query: `
        query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
          jobBoard: jobBoardWithTeams(
            organizationHostedJobsPageName: $organizationHostedJobsPageName
          ) {
            jobPostings {
              id
              title
              locationName
              employmentType
              secondaryLocations {
                locationName
              }
            }
          }
        }
      `,
    };
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });
    const { data } = await response.json<AshbyResponse>();
    if (!data?.jobBoard) throw Error(`Company ${company} not found`);
    return data.jobBoard.jobPostings.map(
      ({ id, title, locationName, secondaryLocations }) => ({
        title,
        location: [
          locationName,
          ...secondaryLocations.map(({ locationName }) => locationName),
        ].join(", "),
        link: `https://jobs.ashbyhq.com/${company}/${id}`,
      })
    );
  },
  greenhouse: async (company) => {
    const getJobElements = async (
      url: string
    ): Promise<HTMLElement[] | null> => {
      const response = await fetch(url);
      const html = await response.text();
      const root = parse(html);
      const list = root.querySelectorAll("div.opening");
      return list.length ? list : null;
    };
    const jobElements =
      (await getJobElements(
        `https://boards.greenhouse.io/embed/job_board?for=${company}`
      )) ?? (await getJobElements(`https://boards.greenhouse.io/${company}`));
    return jobElements.map((element) => {
      const anchor = element.querySelector("a");
      let link = anchor.getAttribute("href");
      if (link && !link.startsWith("http"))
        link = `https://boards.greenhouse.io${link}`;
      if (link) {
        const jobId = new URL(link).searchParams.get("gh_jid");
        if (jobId)
          link = `https://boards.greenhouse.io/${company}/jobs/${jobId}`;
      }
      const location = element.querySelector(".location");
      return {
        title: anchor.textContent,
        location: location.textContent,
        link,
      };
    });
  },
  lever: async (company) => {
    type LeverResponse = {
      text: string;
      hostedUrl: string;
      categories: {
        location: string;
      };
    }[];
    const url = `https://api.lever.co/v0/postings/${company}`;
    const response = await fetch(url);
    const data = await response.json<LeverResponse>();
    if (!Array.isArray(data)) throw Error(`Company ${company} not found`);
    return data.map(({ text, categories: { location }, hostedUrl }) => ({
      title: text,
      location,
      link: hostedUrl,
    }));
  },
};

app.get("/:board/:company", async (ctx) => {
  const board = ctx.req.param("board");
  const company = ctx.req.param("company");
  const getJobs = boards[board];
  if (!getJobs) return ctx.text("Job board not supported", 400);
  try {
    const jobs = await getJobs(company);
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
