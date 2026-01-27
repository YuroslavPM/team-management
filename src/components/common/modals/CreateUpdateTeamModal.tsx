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
import { useEffect, useState } from "react";
import { useGetAllUsers } from "../../../api/userController";
import type { User } from "../../../api/userTypes";
import type { Team } from "../../../api/teams/teamTypes";

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
    setSelectedUsers(
      users
        .filter((user) => team?.users.includes(user.id))
    );
  }, [open]);

  const handleClick = () => {
    if (!team) {
      createTeam({
        name: teamName || "",
        users: selectedUsers?.map((user) => user.id || "") || [],
      });
      setSelectedUsers(undefined);
      onClose();
      return;
    }
    updateTeam({
      id: team?.id || "",
      name: teamName || "",
      users: selectedUsers?.map((user) => user.id || "") || [],
    });
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
          gap: 1,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {!team ? "Create Team" : "Edit Team"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Team Name:
        </Typography>
        <TextField
          required
          id="filled-basic"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTeamName(event.target.value);
          }}
          defaultValue={team?.name}
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Attach users:
        </Typography>
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
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField {...params} label="Fixed tag" placeholder="Team mates" />
          )}
        />
        <Button variant="contained" onClick={handleClick}>
          Create
        </Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};
