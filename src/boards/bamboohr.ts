import { Board } from ".";

type BambooHrResponse = {
  result: {
    id: string;
    jobOpeningName: string;
    location: {
      city: string;
      state: string;
    };
  }[];
};

const bamboohr: Board = async (company) => {
  const url = `https://${company}.bamboohr.com/careers/list`;
  const response = await fetch(url);
  let data: BambooHrResponse;
  try {
    data = await response.json<BambooHrResponse>();
  } catch (e) {
    throw Error(`Company ${company} not found`);
  }
  return data.result.map(({ id, jobOpeningName, location }) => ({
    title: jobOpeningName,
    location: `${location.city}, ${location.state}`,
    link: `https://${company}.bamboohr.com/careers/${id}`,
  }));
};

export default bamboohr;
