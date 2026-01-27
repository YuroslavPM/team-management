import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { userAuthContext } from "../../../utils/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useUpdateUser } from "../../../api/userController";

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditUserModal = (props: EditUserModalProps) => {
  const { onClose, open } = props;

  const { currentUser, setCurrentUser } = userAuthContext();
  const [firstName, setFirstName] = useState(currentUser?.firstName);
  const [lastName, setLastName] = useState(currentUser?.lastName);

  const navigate = useNavigate();
  const { mutate } = useUpdateUser();

  const handleClick = () => {
    if (currentUser?.id && currentUser?.firstName && currentUser?.lastName) {
      mutate(
        {
          id: currentUser?.id,
          firstName: firstName!,
          lastName: lastName!,
        },
        {
          onSuccess: (data) => {
            setCurrentUser(data.data);
            onClose();
          },
        },
      );
    }
  };

  if (!currentUser) {
    navigate("/login");
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 1,}
        }>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Profile
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          First Name
        </Typography>
        <TextField
          required
          id="filled-basic"
          defaultValue={currentUser?.firstName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFirstName(event.target.value);
          }}
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Last Name
        </Typography>
        <TextField
          required
          id="filled-basic"
          defaultValue={currentUser?.lastName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setLastName(event.target.value);
          }}
        />
        <Button variant="contained" onClick={handleClick}>
          Redact
        </Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};
