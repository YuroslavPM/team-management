export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  secret: string;
};

export type Login = {
  email: string;
  secret: string;
};
