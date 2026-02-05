import { type ProjectStatusTypes } from "./projectEnum";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatusTypes;
  adminIds: string[];
  memberIds: string[];
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectPayload = {
  name: string;
  description: string;
  status: ProjectStatusTypes;
  adminIds: string[];
  memberIds: string[];
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ActionUserToProject = {
  id: string;
  adminIds: string[];
  memberIds: string[];
  updatedAt: Date;
};