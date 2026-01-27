export type User = {
  id: string;
  displayName: string;
  email: string;
  secret: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EditUser = {
  id: string;
  firstName: string;
  lastName: string;
}