export type Team = {
  id: string;
  name: string;
  users: string[];
  updatedAt: Date;
};

export type TeamPayload = {
  name: string;
  users: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ActionUserToTeam = {
  id: string;
  users: string[];
  updatedAt: Date;
};
