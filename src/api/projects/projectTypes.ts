import { type ProjectStatusTypes } from "./projectEnum";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatusTypes;
  adminIds: number[];
  memberIds: number[];
  teamIds: string[];
  created_at: Date;
  updated_at: Date;
};

export type ProjectPayload = {
  name: string;
  description: string;
  status: ProjectStatusTypes;
  adminIds: number[];
  memberIds: number[];
  teamIds: string[];
  created_at: Date;
  updated_at: Date;
};

export type ActionUserToProject = {
  id: string;
  adminIds: string[];
  memberIds: string[];
  updated_at: Date;
};