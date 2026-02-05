export type Team = {
  id: string;
  name: string;
  users: string[];
};

export type TeamPayload = {
  name: string;
  users: string[];
};

export type ActionUserToTeam = {
  id: string;
  users: string[];
  updatedAt: Date;
};