/* eslint-disable react-hooks/set-state-in-effect */
import { Controller, useForm } from "react-hook-form";
import {
  useCreateProject,
  useUpdateProject,
} from "../../../api/projects/projectController";
import type { Project } from "../../../api/projects/projectTypes";
import { useGetAllUsers } from "../../../api/userController";
import type { User } from "../../../api/userTypes";
import type { Team } from "../../../api/teams/teamTypes";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Chip,
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
  InputLabel,
  Button,
} from "@mui/material";
import { useGetAllTeams } from "../../../api/teams/teamController";
import {
  ProjectStatus,
  type ProjectStatusTypes,
} from "../../../api/projects/projectEnum";
import { useEffect } from "react";
import { CommonButton } from "../../common/CommonButton";

type CreateUpdateProjectProps = {
  open: boolean;
  project?: Project;
  onClose: () => void;
};

type ProjectForm = {
  name: string;
  description: string;
  status: ProjectStatusTypes;
  admins: User[];
  members: User[];
  teams: Team[];
};

export const CreateUpdateProjectModal = (props: CreateUpdateProjectProps) => {
  const { open, project, onClose } = props;

  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { data: users = [] } = useGetAllUsers();
  const { data: allTeams = [] } = useGetAllTeams();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectForm>();

  useEffect(() => {
    if (project) {
      reset({
        name: project?.name || "",
        description: project?.description || "",
        status: project?.status,
      });
    }

    if (project && allTeams && users) {
      reset({
        admins: project?.adminIds
          ?.map((user) => users.find((x) => x.id === user))
          ?.filter(Boolean),
        members: project?.memberIds?.map((user) =>
          users.find((x) => x.id === user),
        ),
        teams: project?.teamIds?.map((team) =>
          allTeams.find((x) => x.id === team),
        ),
      });
    } else {
      reset({
        admins: undefined,
        members: undefined,
        teams: undefined,
      });
    }
  }, [users, allTeams, project, reset]);

  const admins = watch("admins") || [];
  const teams = watch("teams") || [];
  const members = watch("members") || [];
  const status = watch("status") || [];

  const handleClick = (formData: ProjectForm) => {
    if (!project) {
      createProject({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        adminIds: formData.admins?.map((user) => user.id || "") || [],
        memberIds: formData.members?.map((user) => user.id || "") || [],
        teamIds: formData.teams?.map((team) => team.id) || [],
      });
    } else {
      updateProject({
        id: project!.id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        adminIds: formData.admins?.map((user) => user.id || "") || [],
        memberIds: formData.members?.map((user) => user.id || "") || [],
        teamIds: formData.teams?.map((team) => team.id) || [],
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
          {!project ? "Create Project" : "Edit Project"}
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Project name"
              error={!!errors.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("name", event.target.value);
              }}
              placeholder="Fill name"
              defaultValue={project?.name}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Project description"
              error={!!errors.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("description", event.target.value);
              }}
              placeholder="Fill description"
              multiline
              maxRows={4}
              defaultValue={project?.description}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                {...field}
                value={status}
                label="Status"
                onChange={(event: SelectChangeEvent) => {
                  setValue("status", event.target.value as ProjectStatusTypes);
                }}
              >
                {Object.values(ProjectStatus).map((s) => (
                  <MenuItem value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="admins"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={users.filter((user) => !members?.includes(user))}
              getOptionLabel={(option) => option.firstName}
              onChange={(_e, value) => {
                setValue("admins", value);
              }}
              renderValue={(values) =>
                values.map((option) => {
                  return <Chip key={option.id} label={option.firstName} />;
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project admins"
                  placeholder="Project admins"
                />
              )}
            />
          )}
        />
        <Controller
          name="members"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={users.filter((user) => !admins?.includes(user))}
              getOptionLabel={(option) => option.firstName}
              onChange={(_e, value) => {
                setValue("members", value);
              }}
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
                  label="Project members"
                  placeholder="Project members"
                />
              )}
            />
          )}
        />
        <Controller
          name="teams"
          control={control}
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
        <Button type="submit" variant="contained">
          {!project ? "Create" : "Edit"}
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
