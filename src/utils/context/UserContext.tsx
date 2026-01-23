import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "../../api/userTypes";

type AuthContextProps = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const initialValues: AuthContextProps = {
  currentUser: undefined,
  setCurrentUser: () => null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<AuthContextProps>(initialValues);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>();

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const userAuthContext = () => {
  return useContext(UserContext);
};
