/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
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
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useGetAllTeams } from "../../../api/teams/teamController";
import { userAuthContext } from "../../../utils/context/UserContext";
import {
  ProjectStatus,
  type ProjectStatusTypes,
} from "../../../api/projects/projectEnum";

type CreateUpdateProjectProps = {
  open: boolean;
  project?: Project;
  onClose: () => void;
};

export const CreateUpdateProjectModal = (props: CreateUpdateProjectProps) => {
  const { open, project, onClose } = props;

  const { currentUser } = userAuthContext();

  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();
  const { data: users = [] } = useGetAllUsers();
  const { data: teams = [] } = useGetAllTeams();

  const [projectName, setProjectName] = useState(project?.name || "");
  const [projectDescription, setProjectDescription] = useState(
    project?.description || "",
  );
  const [projectStatus, setProjectStatus] = useState<ProjectStatusTypes>(
    project?.status as ProjectStatusTypes,
  );
  const [selectedAdmins, setSelectedAdmins] = useState<User[]>();
  const [selectedMembers, setSelectedMembers] = useState<User[]>();
  const [selectedTeams, setSelectedTeams] = useState<Team[]>();

  useEffect(() => {
    setProjectName("");
    if (project?.name) {
      setProjectName(project.name);
    }
  }, [open, project?.name]);

  useEffect(() => {
    setProjectDescription("");
    if (project?.description) {
      setProjectDescription(project.description);
    }
  }, [open, project?.description]);

  useEffect(() => {
    if (project?.status) {
      setProjectStatus(project.status);
    }
  }, [open, project?.status]);

  useEffect(() => {
    setSelectedAdmins(undefined);
    if (project?.adminIds) {
      setSelectedAdmins(
        users.filter((user) => project?.adminIds.includes(user.id)),
      );
    }
  }, [open, project?.adminIds, users]);

  useEffect(() => {
    setSelectedMembers(undefined);
    if (project?.memberIds) {
      setSelectedMembers(
        users.filter((user) => project?.memberIds.includes(user.id)),
      );
    }
  }, [open, project?.memberIds, users]);

  useEffect(() => {
    setSelectedTeams(undefined);
    if (project?.teamIds) {
      setSelectedTeams(
        teams.filter((user) => project?.teamIds.includes(user.id)),
      );
    }
  }, [open, project?.teamIds, users, teams]);

  const handleClick = () => {
    if (!project && projectName && projectDescription) {
      createProject({
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        adminIds: selectedAdmins?.map((user) => user.id || "") || [],
        memberIds: selectedMembers?.map((user) => user.id || "") || [],
        teamIds: selectedTeams?.map((team) => team.id) || [],
      });
    } else {
      updateProject({
        id: project!.id,
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        adminIds: selectedAdmins?.map((user) => user.id || "") || [],
        memberIds: selectedMembers?.map((user) => user.id || "") || [],
        teamIds: selectedTeams?.map((team) => team.id) || [],
      });
    }
    setSelectedAdmins(undefined);
    setSelectedMembers(undefined);
    setSelectedTeams(undefined);
    onClose();
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setProjectStatus(event.target.value as ProjectStatusTypes);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
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

        <TextField
          required
          id="filled-basic"
          label="Project name"
          placeholder="Fill name"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setProjectName(event.target.value);
          }}
          defaultValue={project?.name}
        />
        <TextField
          required
          id="filled-multiline-flexible"
          label="Project description"
          placeholder="Fill description"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setProjectDescription(event.target.value);
          }}
          multiline
          maxRows={4}
          defaultValue={project?.description}
        />
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={projectStatus}
            label="Status"
            onChange={handleChangeStatus}
          >
            {Object.values(ProjectStatus).map((s) => (
              <MenuItem value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          multiple
          id="admins-selected"
          value={selectedAdmins}
          onChange={(event, newValue) => {
            setSelectedAdmins(newValue);
          }}
          options={users.filter((user) => !selectedMembers?.includes(user))}
          getOptionLabel={(option) => option.firstName}
          renderValue={(values, getItemProps) =>
            values.map((option, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return <Chip key={key} label={option.firstName} {...itemProps} />;
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
        <Autocomplete
          multiple
          id="members-selected"
          value={selectedMembers}
          onChange={(event, newValue) => {
            setSelectedMembers(newValue);
          }}
          options={users.filter((user) => !selectedAdmins?.includes(user))}
          getOptionLabel={(option) => option.firstName}
          renderValue={(values, getItemProps) =>
            values.map((option, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return <Chip key={key} label={option.firstName} {...itemProps} />;
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
        <Autocomplete
          multiple
          id="teams-selected"
          value={selectedTeams}
          onChange={(event, newValue) => {
            setSelectedTeams(newValue);
          }}
          options={teams.filter((team) => team.users.includes(currentUser!.id))}
          getOptionLabel={(option) => option.name}
          renderValue={(values, getItemProps) =>
            values.map((option, index) => {
              const { key, ...itemProps } = getItemProps({ index });
              return <Chip key={key} label={option.name} {...itemProps} />;
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

        <Button
          variant="contained"
          onClick={handleClick}
          disabled={Boolean(
            !projectName ||
            !projectDescription ||
            !projectStatus ||
            !selectedAdmins ||
            !selectedMembers,
          )}
        >
          {!project ? "Create" : "Edit"}
        </Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};
