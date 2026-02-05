export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Login = {
  email: string;
  secret: string;
};
