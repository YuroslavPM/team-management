import { type ProjectStatusTypes } from "./projectEnum";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatusTypes;
  adminIds: string[];
  memberIds: string[];
  teamIds: string[];
};

export type ProjectPayload = {
  name: string;
  description: string;
  status: ProjectStatusTypes;
  adminIds: string[];
  memberIds: string[];
  teamIds: string[];
};
