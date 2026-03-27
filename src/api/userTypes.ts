export type User = {
  id: number;
  display_name: string;
  email: string;
  secret: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
};

export type EditUser = {
  id: number;
  first_name: string;
  last_name: string;
  is_admin: boolean;
};
