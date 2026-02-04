import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useUpdateUser } from "../../../api/userController";
import { CommonButton } from "../../common/CommonButton";
import type { User } from "../../../api/userTypes";
import { Controller, useForm } from "react-hook-form";
import type { Team } from "../../../api/teams/teamTypes";
import {
  useGetAllTeams,
  useUpdateTeam,
} from "../../../api/teams/teamController";
import { useGetAllProjects } from "../../../api/projects/projectController";
import { useGetAllTasks } from "../../../api/tasks/taskController";

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
};

type EditUserForm = {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  teams: Team[];
};

export const EditUserModal = (props: EditUserModalProps) => {
  const { onClose, open, user } = props;

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: updateTeam } = useUpdateTeam();
  const { data: allTeams } = useGetAllTeams();
  const { data: allProjects } = useGetAllProjects();
  const { data: allTasks } = useGetAllTasks();

  const userTeams = allTeams?.filter((team) =>
    team.users.find((x) => x === user?.id),
  );

  const {
    control: editUser,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<EditUserForm>({
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      isAdmin: user?.isAdmin,
      // teams: userTeams,
    },
  });

  const teams = watch("teams") || [];

  useEffect(() => {
    if (user && open) {
      reset({
        firstName: user?.firstName,
        lastName: user?.lastName,
        isAdmin: user?.isAdmin,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        teams: undefined,
      });
    }
  }, [open, reset, user]);

  const handleClick = (formData: EditUserForm) => {
    if (user.id && formData.firstName && formData.lastName) {
      updateUser(
        {
          id: user?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          isAdmin: formData.isAdmin,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
    // if(formData.teams){
    //   updateTeam({
    //     users:
    //   })
    // }
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
        onSubmit={handleSubmit((data) => {
          // console.log(data);
          handleClick(data);
        })}
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
        <Controller
          name="isAdmin"
          control={editUser}
          render={({ field }) => (
            <FormControlLabel
              {...field}
              control={
                <Checkbox
                  checked={!!field.value}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                  }}
                />
              }
              label="Admin"
            />
          )}
        />
        <Controller
          name="teams"
          control={editUser}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={allTeams?.filter((x) => !teams.includes(x)) || []}
              getOptionLabel={(option) => option.name}
              onChange={(_e, value) => {
                setValue("teams", value);
              }}
              renderValue={(values, getItemProps) =>
                values.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index });
                  return <Chip key={key} label={option?.name} {...itemProps} />;
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign team"
                  placeholder="Assign team"
                />
              )}
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
