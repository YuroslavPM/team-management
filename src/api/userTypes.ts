export type User = {
  id: number;
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
  id: number;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  updated_at: Date;
};
