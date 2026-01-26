import { useState } from "react";
import { userAuthContext } from "../../utils/context/UserContext";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar } from "@mui/material";
import { getDisplayName } from "../../utils/helpers/getDisplayName";
import { deepOrange } from "@mui/material/colors";
import { useDeleteUser } from "../../api/userController";
import dayjs from "dayjs";
import { EditUserModal } from "../../components/common/modals/EditUserModal";

export const ProfilePage = () => {
  const { currentUser } = userAuthContext();
  const userId = currentUser?.id;
  const navigate = useNavigate();
  const userCreatedAt = currentUser?.createdAt;
  const { mutate } = useDeleteUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteUser = () => {
    if (userId) {
      mutate(userId);
    }
    navigate("/");
  };

  if (!currentUser) {
    navigate("/login");
    return;
  }

  return (
    <Box>
      <Card
        sx={{
          minWidth: 500,
          minHeight: 200,
          bgcolor: "#e7e9ee",
          width: "round(11px, 1px)",
        }}
      >
        <CardContent>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 16 }}
          >
            Welcome {getDisplayName(currentUser)}!
          </Typography>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>
            {currentUser?.firstName.charAt(0)}
          </Avatar>
          <Typography variant="h5" component="div">
            {currentUser?.firstName}
          </Typography>
          <Typography variant="body2">
            E-mail:{currentUser?.email}
            <br />
            You are here since: {dayjs(userCreatedAt).format("DD/MM/YYYY")}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              setIsOpen(true);
            }}
            sx={{
              bgcolor: "#87CEEB",
              color: "white",
            }}
          >
            Edit
          </Button>

          <EditUserModal open={isOpen} onClose={() => setIsOpen(false)} />

          <Button
            size="small"
            sx={{
              bgcolor: "red",
              color: "white",
            }}
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
