import { Board } from ".";
import { HTMLElement, parse } from "node-html-parser";

const greenhouse: Board = async (company) => {
  const getJobElements = async (url: string): Promise<HTMLElement[] | null> => {
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
  if (!jobElements?.length) throw Error(`Company ${company} not found`);
  return jobElements.map((element) => {
    const anchor = element.querySelector("a");
    let link = anchor.getAttribute("href");
    if (link && !link.startsWith("http"))
      link = `https://boards.greenhouse.io${link}`;
    if (link) {
      const jobId = new URL(link).searchParams.get("gh_jid");
      if (jobId) link = `https://boards.greenhouse.io/${company}/jobs/${jobId}`;
    }
    const location = element.querySelector(".location");
    return {
      title: anchor.textContent,
      location: location.textContent,
      link,
    };
  });
};

export default greenhouse;
