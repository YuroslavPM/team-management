export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  secret: string;
  created_at: Date;
  updated_at: Date;
};

export type Login = {
  email: string;
  secret: string;
};
