/* eslint-disable react-hooks/set-state-in-effect */
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateTeam,
  useUpdateTeam,
} from "../../../api/teams/teamController";
import { useEffect } from "react";
import { useGetAllUsers } from "../../../api/userController";
import type { User } from "../../../api/userTypes";
import type { Team } from "../../../api/teams/teamTypes";
import { CommonButton } from "../../common/CommonButton";
import { Controller, useForm } from "react-hook-form";

type CreateTeamModalProps = {
  open: boolean;
  team?: Team;
  onClose: () => void;
};

type CreateUpdateTeamForm = {
  teamName: string;
  teamUsers: User[];
};

export const CreateUpdateTeamModal = (props: CreateTeamModalProps) => {
  const { open, team, onClose } = props;

  const { mutate: createTeam } = useCreateTeam();
  const { mutate: updateTeam } = useUpdateTeam();
  const { data: users = [] } = useGetAllUsers();

  const {
    control: createUpdateTeam,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateUpdateTeamForm>({
    mode: "onChange",
    defaultValues: {
      teamName: team?.name || "",
      teamUsers: team?.users?.map((user) => users.find((u) => u.id === user)),
    },
  });

  useEffect(() => {
    if (team) {
      reset({
        teamName: team?.name || "",
        teamUsers: team?.users?.map((user) => users.find((u) => u.id === user)),
      });
    } else {
      reset({
        teamName: "",
        teamUsers: undefined,
      });
    }
  }, [open, reset, team, team?.users, users]);

  const handleClick = (formData: CreateUpdateTeamForm) => {
    if (!team) {
      createTeam({
        name: formData.teamName,
        users: formData.teamUsers?.map((user) => user.id || "") || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      updateTeam({
        id: team.id,
        name: formData.teamName,
        users: formData.teamUsers?.map((user) => user.id || "") || [],
        updatedAt: new Date(),
      });
    }
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component={"form"}
        onSubmit={handleSubmit((data) => handleClick(data))}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {!team ? "Create Team" : "Edit Team"}
        </Typography>

        <Controller
          name="teamName"
          control={createUpdateTeam}
          rules={{
            required: "Team name is required!",
            validate: (value) =>
              value.length >= 3 || "First name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors.teamName}
              label="Team name"
              placeholder="Fill name"
              onChange={(e) => {
                field.onChange(e);
              }}
              defaultValue={team?.name}
              helperText={errors.teamName?.message}
            />
          )}
        />
        <Controller
          name="teamUsers"
          control={createUpdateTeam}
          rules={{
            required: "Team users is required!",
          }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              onChange={(_e, value) => {
                setValue("teamUsers", value);
              }}
              options={users}
              getOptionLabel={(option) => option.firstName}
              renderValue={(values, getItemProps) =>
                values.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index });
                  return (
                    <Chip key={key} label={option.firstName} {...itemProps} />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Team users"
                  placeholder="Team mates"
                  helperText={errors.teamUsers?.message}
                />
              )}
            />
          )}
        />
        <Button variant="contained" type="submit" disabled={!isValid}>
          {!team ? "Create" : "Edit"}
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
