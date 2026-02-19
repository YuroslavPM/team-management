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
  useAddUserToTeam,
  useGetAllTeams,
  useRemoveUserToTeam,
} from "../../../api/teams/teamController";
import {
  useAddUserToProject,
  useGetAllProjects,
  useRemoveUserToProject,
} from "../../../api/projects/projectController";
import {
  useAddUserToTask,
  useGetAllTasks,
  useRemoveUserToTask,
} from "../../../api/tasks/taskController";
import type { Project } from "../../../api/projects/projectTypes";
import type { Task } from "../../../api/tasks/taskTypes";

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  user: User;
};

type EditUserForm = {
  first_name: string;
  last_name: string;
  is_admin: boolean;
  teams: Team[] | undefined;
  projects: Project[] | undefined;
  tasks: Task[] | undefined;
};

export const EditUserModal = (props: EditUserModalProps) => {
  const { onClose, open, user } = props;

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: addUserToTeam } = useAddUserToTeam();
  const { mutate: removeUserToTeam } = useRemoveUserToTeam();
  const { mutate: addUserToProject } = useAddUserToProject();
  const { mutate: removeUserToProject } = useRemoveUserToProject();
  const { mutate: addUserToTask } = useAddUserToTask();
  const { mutate: removeUserToTask } = useRemoveUserToTask();
  const { data: allTeams } = useGetAllTeams();
  const { data: allProjects } = useGetAllProjects();
  const { data: allTasks } = useGetAllTasks();

  const userTeams = allTeams?.filter((team) =>
    team.users.find((x) => x === user?.id),
  );

  const userProjects = allProjects?.filter(
    (project) =>
      project.adminIds.find((admin) => admin === user?.id) ||
      project.memberIds.find((member) => member === user?.id),
  );

  const userTasks = allTasks?.filter((task) => {
    const assigned = task.assignedUserId;
    if (Array.isArray(assigned)) {
      return assigned.includes(user?.id);
    }
    return assigned === user?.id;
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<EditUserForm>();

  const teams = watch("teams") || [];
  const projects = watch("projects") || [];
  const tasks = watch("tasks") || [];

  useEffect(() => {
    if (!open) return;
    if (user) {
      reset({
        first_name: user?.first_name ?? "",
        last_name: user?.last_name ?? "",
        is_admin: user?.is_admin ?? false,
        teams: userTeams ?? [],
        projects: userProjects ?? [],
        tasks: userTasks ?? [],
      });
    } else {
      reset({
        first_name: "",
        last_name: "",
        is_admin: false,
        teams: [],
        projects: [],
        tasks: [],
      });
    }
  }, [open]);

  const handleClick = (formData: EditUserForm) => {
    if (
      user.id &&
      (formData.first_name !== user.first_name ||
        formData.last_name !== user.last_name)
    ) {
      updateUser(
        {
          id: user?.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          is_admin: formData.is_admin,
          updated_at: new Date(),
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
    if (formData.teams !== userTeams) {
      const selectedTeams = formData.teams ?? [];
      const userTeamIds = new Set(userTeams?.map((t) => t.id));
      const selectedTeamIds = new Set(selectedTeams.map((t) => t.id));

      const teamIn = selectedTeams.filter((t) => !userTeamIds.has(t.id));
      const teamOut =
        userTeams?.filter((t) => !selectedTeamIds.has(t.id)) ?? [];

      teamIn.map((team) => {
        const updatedUsers = [...team.users, user.id];

        addUserToTeam({
          id: team.id,
          users: updatedUsers,
          updated_at: new Date(),
        });
      });

      teamOut.map((team) => {
        const updatedUsers = team.users.filter((u) => u !== user.id);

        removeUserToTeam({
          id: team.id,
          users: updatedUsers,
          updated_at: new Date(),
        });
      });
    }

    if (formData.projects !== userProjects) {
      const selectedProjects = formData.projects ?? [];
      const userProjectIds = new Set(userProjects?.map((p) => p.id));
      const selectedProjectIds = new Set(selectedProjects?.map((p) => p.id));

      const projectIn = selectedProjects.filter(
        (p) => !userProjectIds.has(p.id),
      );

      const projectOut =
        userProjects?.filter((p) => !selectedProjectIds.has(p.id)) ?? [];

      projectIn.map((project) => {
        const updateAdmins = [...project.adminIds, user.id];
        addUserToProject({
          id: project.id,
          adminIds: updateAdmins,
          memberIds: project.memberIds,
          updated_at: new Date(),
        });
      });

      projectOut.map((project) => {
        const updateAdmins = project.adminIds.filter((u) => u !== user.id);
        const updateMembers = project.memberIds.filter((u) => u !== user.id);
        removeUserToProject({
          id: project.id,
          adminIds: updateAdmins,
          memberIds: updateMembers,
          updated_at: new Date(),
        });
      });
    }

    if (formData.tasks !== userTasks) {
      const selectedTasks = formData.tasks ?? [];
      const userTaskIds = new Set(userTasks?.map((p) => p.id));
      const selectedTaskIds = new Set(selectedTasks?.map((p) => p.id));

      const taskIn = selectedTasks.filter((p) => !userTaskIds.has(p.id));

      const taskOut =
        userTasks?.filter((p) => !selectedTaskIds.has(p.id)) ?? [];

      taskIn.map((task) => {
        const updateAssigned = [
          ...(Array.isArray(task.assignedUserId) ? task.assignedUserId : []),
          user.id,
        ];

        const taskProjectId = task.projectId;

        const project = allProjects?.find(
          (project) => project.id === String(taskProjectId),
        );

        const isMember = project?.memberIds.includes(user.id);
        const is_admin = project?.adminIds.includes(user.id);

        if (!isMember && !is_admin && project) {
          const updateAdmins = [...project.adminIds, user.id];

          addUserToProject({
            id: project.id,
            memberIds: project.memberIds,
            adminIds: updateAdmins,
            updated_at: new Date(),
          });
        }

        addUserToTask({
          id: task.id,
          assignedUserId: updateAssigned,
          updated_at: new Date(),
        });
      });

      taskOut.map((task) => {
        const updateAssigned = task.assignedUserId.filter((u) => u !== user.id);
        removeUserToTask({
          id: task.id,
          assignedUserId: updateAssigned,
          updated_at: new Date(),
        });
      });
    }

    reset();
    onClose();
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
          name="first_name"
          control={control}
          rules={{
            validate: (value) =>
              value.length >= 3 || "First name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              placeholder="First name"
              defaultValue={user?.first_name}
              error={!!errors.first_name}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.first_name?.message}
            />
          )}
        />
        <Controller
          name="last_name"
          control={control}
          rules={{
            validate: (value) =>
              value.length >= 3 || "Last name must be at least 3 characters",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              placeholder="Last name"
              defaultValue={user?.last_name}
              error={!!errors.last_name}
              onChange={(e) => {
                field.onChange(e);
              }}
              helperText={errors.last_name?.message}
            />
          )}
        />
        <Controller
          name="is_admin"
          control={control}
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
        <Controller
          name="projects"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={allProjects?.filter((x) => !projects.includes(x)) || []}
              getOptionLabel={(option) => option.name}
              onChange={(_e, value) => {
                setValue("projects", value);
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
                  label="Assign project"
                  placeholder="Assign project"
                />
              )}
            />
          )}
        />
        <Controller
          name="tasks"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={allTasks?.filter((x) => !tasks.includes(x)) || []}
              getOptionLabel={(option) => option.title}
              onChange={(_e, value) => {
                setValue("tasks", value);
              }}
              renderValue={(values, getItemProps) =>
                values.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index });
                  return (
                    <Chip key={key} label={option?.title} {...itemProps} />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign task"
                  placeholder="Assign task"
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
