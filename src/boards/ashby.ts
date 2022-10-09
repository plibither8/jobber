import { Board } from ".";

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

const ashby: Board = async (company) => {
  const url =
    "https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiBoardWithTeams";
  const body = {
    operationName: "ApiBoardWithTeams",
    variables: {
      organizationHostedJobsPageName: company,
    },
    query: `
        query ApiBoardWithTeams($organizationHostedJobsPageName: String!) {
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
};

export default ashby;
