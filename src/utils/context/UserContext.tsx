/* eslint-disable react-hooks/rules-of-hooks */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../../api/userTypes";
import { useGetAllUsers } from "../../api/userController";

type AuthContextProps = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  handleLogout: () => void;
};

const initialValues: AuthContextProps = {
  currentUser: undefined,
  setCurrentUser: () => null,
  handleLogout: () => null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<AuthContextProps>(initialValues);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(
    initialValues.currentUser,
  );

  const { data: users } = useGetAllUsers();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    console.log("saved", saved);

    if (!saved) {
      return;
    }

    const parsed = JSON.parse(saved || "") as User;

    if (parsed) {
      const validUser = users?.find(
        (x) =>
          x.id === parsed.id &&
          x.email === parsed.email &&
          x.secret === parsed.secret,
      );

      if (validUser) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentUser(validUser);
      }
    }
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem("user");

    setCurrentUser(undefined);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const userAuthContext = () => {
  return useContext(UserContext);
};
