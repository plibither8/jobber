import ashby from "./ashby";
import greenhouse from "./greenhouse";
import lever from "./lever";
import bamboohr from "./bamboohr";
import workable from "./workable";

export interface Job {
  title: string;
  location: string;
  link: string;
}

export type Board = (company: string) => Promise<Job[]>;

const boards: Record<string, Board> = {
  ashby,
  greenhouse,
  lever,
  bamboohr,
  workable,
};

export default boards;
