import { Box } from "@mui/material";
import { useGetAllUsers } from "../api/userController";
import { userAuthContext } from "../utils/context/UserContext";

export const LandingPage = () => {
  const { data } = useGetAllUsers();
  console.log(data);

  const { currentUser } = userAuthContext();
  console.log("logged user", currentUser);

  return <Box>Landing</Box>;
};
