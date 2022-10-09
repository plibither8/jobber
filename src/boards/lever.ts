import { Board } from ".";

type LeverResponse = {
  text: string;
  hostedUrl: string;
  categories: {
    location: string;
  };
}[];

const lever: Board = async (company) => {
  const url = `https://api.lever.co/v0/postings/${company}`;
  const response = await fetch(url);
  const data = await response.json<LeverResponse>();
  if (!Array.isArray(data)) throw Error(`Company ${company} not found`);
  return data.map(({ text, categories: { location }, hostedUrl }) => ({
    title: text,
    location,
    link: hostedUrl,
  }));
};

export default lever;
