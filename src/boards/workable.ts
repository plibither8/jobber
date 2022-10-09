import { Board, Job } from ".";

type WorkableResponse = {
  nextPage: string;
  results: {
    id: string;
    title: string;
    location: {
      city: string;
      country: string;
      countryCode: string;
      region?: string;
    };
  }[];
  total: number;
};

const workable: Board = async (company) => {
  const url = `https://apply.workable.com/api/v3/accounts/${company}/jobs`;

  let total: number;
  let token: string;
  const jobs: Job[] = [];

  do {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "content-type": "application/json",
      },
    });
    const data = await response.json<WorkableResponse>();
    if (!data.results) throw Error(`Company ${company} not found`);

    jobs.push(
      ...data.results.map(({ id, title, location }) => ({
        title,
        location: `${location.city}, ${location.region || location.country}`,
        link: `https://${company}.workable.com/j/${id}`,
      }))
    );

    total = data.total;
    token = data.nextPage;
  } while (jobs.length < total);

  return jobs;
};

export default workable;
