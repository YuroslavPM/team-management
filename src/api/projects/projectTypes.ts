import { type ProjectStatusTypes } from "./projectEnum";

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatusTypes;
  admins: number[];
  members: number[];
  teams: number[];
  created_at: Date;
  updated_at: Date;
};

export type ProjectPayload = {
  name: string;
  description: string;
  status: ProjectStatusTypes;
  admins: number[];
  members: number[];
  teams: number[];
  created_at: Date;
  updated_at: Date;
};

export type ActionUserToProject = {
  id: string;
  admins: string[];
  members: string[];
  updated_at: Date;
};