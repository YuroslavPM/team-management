export type User = {
  id: string;
  display_name: string;
  email: string;
  secret: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
};

export type EditUser = {
  id: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  updated_at: Date;
};
