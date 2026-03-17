import type { User } from "../userTypes";

export type Team = {
  id: number;
  name: string;
  users: User[];
  updated_at: Date;
};

export type TeamPayload = {
  name: string;
  users: number[];
  updated_at: Date;
};

export type ActionUserToTeam = {
  id: string;
  users: User[];
  updated_at: Date;
};
