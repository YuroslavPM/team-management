export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  secret: string;
};

export type Login = {
  email: string;
  secret: string;
};
