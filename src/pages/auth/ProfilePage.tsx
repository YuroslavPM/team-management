import { useState } from "react";
import { userAuthContext } from "../../utils/context/UserContext";
import Box from "@mui/material/Box";
import { useDeleteUser, useGetAllUsers } from "../../api/userController";
import { EditUserModal } from "../../components/views/Profile/EditUserModal";
import { AlertDialog } from "../../components/common/AlertDialog";
import { ProfileCard } from "../../components/views/Profile/ProfileCard";
import { UsersTable } from "../../components/views/Profile/UsersTable";
import type { User } from "../../api/userTypes";

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = userAuthContext();
  const { mutate } = useDeleteUser();
  const { data: allUsers } = useGetAllUsers();

  const [user, setUser] = useState<User>();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const handleDeleteUser = () => {
    if (user?.id) {
      mutate(user.id);
    }
    if (user?.id === currentUser?.id) {
      setCurrentUser(undefined);
    }
  };

  return (
    <>
      <Box>
        <ProfileCard
          user={currentUser}
          onEditClick={() => {
            setUser(currentUser);
            setIsOpenEditModal(true);
          }}
          onDeleteClick={() => {
            setIsOpenDeleteModal(true);
          }}
        />
        {currentUser?.isAdmin ? (
          <Box
            sx={{ minWidth: 1, marginTop: 15 }}
          >
            <UsersTable
              allUsers={allUsers!}
              onEditClick={() => {
                setIsOpenEditModal(true);
              }}
              onDelete={() => {
                setIsOpenDeleteModal(true);
              }}
              user={(value: User) => {
                setUser(value);
              }}
            />
          </Box>
        ) : null}
      </Box>

      <EditUserModal
        open={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
        user={user!}
      />
      <AlertDialog
        title={"Delete user"}
        message={"Are you sure you want to delete this account?"}
        open={isOpenDeleteModal}
        onClose={() => {
          setIsOpenDeleteModal(false);
        }}
        handleConfirm={handleDeleteUser}
      />
    </>
  );
};
