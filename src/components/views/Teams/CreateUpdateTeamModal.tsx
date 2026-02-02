/* eslint-disable react-hooks/set-state-in-effect */
import {
  Autocomplete,
  Box,
  Chip,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCreateTeam,
  useUpdateTeam,
} from "../../../api/teams/teamController";
import { useEffect, useState } from "react";
import { useGetAllUsers } from "../../../api/userController";
import type { User } from "../../../api/userTypes";
import type { Team } from "../../../api/teams/teamTypes";
import { CommonButton } from "../../common/CommonButton";

type CreateTeamModalProps = {
  open: boolean;
  team?: Team;
  onClose: () => void;
};

export const CreateUpdateTeamModal = (props: CreateTeamModalProps) => {
  const { open, team, onClose } = props;

  const { mutate: createTeam } = useCreateTeam();
  const { mutate: updateTeam } = useUpdateTeam();
  const { data: users = [] } = useGetAllUsers();

  const [teamName, setTeamName] = useState(team?.name || "");
  const [selectedUsers, setSelectedUsers] = useState<User[]>();

  useEffect(() => {
    if (team?.users) {
      setSelectedUsers(users.filter((user) => team?.users.includes(user.id)));
    }
  }, [open, team?.users, users]);

  const handleClick = () => {
    if (!team) {
      createTeam({
        name: teamName,
        users: selectedUsers?.map((user) => user.id || "") || [],
      });
    } else {
      updateTeam({
        id: team.id,
        name: teamName,
        users: selectedUsers?.map((user) => user.id || "") || [],
      });
    }

    setSelectedUsers(undefined);
    onClose();
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
          {!team ? "Create Team" : "Edit Team"}
        </Typography>

        <TextField
          required
          id="filled-basic"
          label="Team name"
          placeholder="Fill name"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTeamName(event.target.value);
          }}
          defaultValue={team?.name}
        />

        <Autocomplete
          multiple
          id="fixed-tags-demo"
          value={selectedUsers}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue);
          }}
          options={users}
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
              label="Team users"
              placeholder="Team mates"
            />
          )}
        />
        <CommonButton
          text={!team ? "Create" : "Edit"}
          style={{ bgcolor: "#2a70f3", color: "white" }}
          variant="contained"
          disabled={Boolean(!teamName || !selectedUsers)}
          onClick={handleClick}
        />
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
