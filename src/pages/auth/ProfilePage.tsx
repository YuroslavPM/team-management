import { useState } from "react";
import { userAuthContext } from "../../utils/context/UserContext";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Avatar } from "@mui/material";
import { getDisplayName } from "../../utils/helpers/getDisplayName";
import { deepOrange } from "@mui/material/colors";
import { useDeleteUser } from "../../api/userController";
import dayjs from "dayjs";
import { EditUserModal } from "../../components/views/Profile/EditUserModal";
import { AlertDialog } from "../../components/common/AlertDialog";
import { CommonButton } from "../../components/common/CommonButton";
import { CommonText } from "../../components/common/CommonText";

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = userAuthContext();
  const userId = currentUser?.id;
  const userCreatedAt = currentUser?.createdAt;
  const { mutate } = useDeleteUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const handleDeleteUser = () => {
    if (userId) {
      mutate(userId);
    }
    setCurrentUser(undefined);
  };

  return (
    <>
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
            <CommonText
              text={"Welcome "}
              value={getDisplayName(currentUser) + "!"}
              style={{ color: "text.secondary", fontSize: 16 }}
              gutterBottom
            />
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
              {currentUser?.firstName.charAt(0)}
            </Avatar>
            <CommonText
              text={""}
              value={currentUser?.firstName}
              variant={"h5"}
              style={null}
            />
            <CommonText
              text={"E-mail: "}
              value={currentUser?.email}
              variant={"body2"}
              style={null}
            />
            <CommonText
              text={"You are here since: "}
              value={dayjs(userCreatedAt).format("DD/MM/YYYY")}
              variant={"body2"}
              style={null}
            />
          </CardContent>
          <CardActions>
            <CommonButton
              text={"Edit"}
              style={{ bgcolor: "#87CEEB", color: "white" }}
              size="small"
              onClick={() => {
                setIsOpen(true);
              }}
            />
            <CommonButton
              text={"Delete"}
              style={{ bgcolor: "red", color: "white" }}
              size="small"
              onClick={() => {
                setIsOpenDeleteModal(true);
              }}
            />
          </CardActions>
        </Card>
      </Box>
      <EditUserModal open={isOpen} onClose={() => setIsOpen(false)} />
      <AlertDialog
        title={"Delete user"}
        message={"Are you sure you want to delete your account?"}
        open={isOpenDeleteModal}
        onClose={() => {
          setIsOpenDeleteModal(false);
        }}
        handleConfirm={handleDeleteUser}
      />
    </>
  );
};
