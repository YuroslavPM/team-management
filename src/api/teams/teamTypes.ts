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
};

export type ActionUserToTeam = {
  id: number;
  users: number[];
};
