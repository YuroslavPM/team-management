export type Team = {
  id: string;
  name: string;
  users: string[];
  updated_at: Date;
};

export type TeamPayload = {
  name: string;
  users: string[];
  created_at: Date;
  updated_at: Date;
};

export type ActionUserToTeam = {
  id: string;
  users: string[];
  updated_at: Date;
};
