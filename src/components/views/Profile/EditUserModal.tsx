import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useUpdateUser } from "../../../api/userController";
import { CommonButton } from "../../common/CommonButton";
import type { User } from "../../../api/userTypes";
import { Controller, useForm } from "react-hook-form";

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
};

type EditUserForm = {
  firstName: string;
  lastName: string;
};

export const EditUserModal = (props: EditUserModalProps) => {
  const { onClose, open, user } = props;

  const { mutate: updateProject } = useUpdateUser();

  const {
    control: editUser,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EditUserForm>({
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user?.firstName,
        lastName: user?.lastName,
      });
    }else{
      reset({
        firstName:"",
        lastName:""
      })
    }
  });

  const handleClick = (formData: EditUserForm) => {
    if (user.id && formData.firstName && formData.lastName) {
      updateProject(
        {
          id: user?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component={"form"}
        onSubmit={handleSubmit((data) => handleClick(data))}
        sx={{
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
          gap: 1,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Profile
        </Typography>
        <Controller
          name="firstName"
          control={editUser}
          rules={{
            validate: (value) =>
              value.length >= 3 || "First name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              placeholder="First name"
              defaultValue={user?.firstName}
              error={!!errors.firstName}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={editUser}
          rules={{
            validate: (value) =>
              value.length >= 3 || "Last name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              placeholder="Last name"
              defaultValue={user?.lastName}
              error={!!errors.lastName}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.lastName?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={!isValid}>
          Redact
        </Button>
        <CommonButton
          text={"Close"}
          style={{ bgcolor: "#2a70f3", color: "white" }}
          variant="contained"
          onClick={onClose}
        />
      </Box>
    </Modal>
  );
};
