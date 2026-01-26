export type User = {
  id: number;
  displayName: string;
  email: string;
  secret: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EditUser = {
  id: number;
  firstName: string;
  lastName: string;
}