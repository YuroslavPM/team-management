import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { CreateUpdateTeamModal } from "../components/views/Teams/CreateUpdateTeamModal";
import { useDeleteTeam, useGetAllTeams } from "../api/teams/teamController";
import { userAuthContext } from "../utils/context/UserContext";
import type { Team } from "../api/teams/teamTypes";
import { TeamCard } from "../components/views/Teams/TeamCard";
import { AlertDialog } from "../components/common/AlertDialog";

export const TeamsPage = () => {
  const { currentUser } = userAuthContext();

  const { data: teams } = useGetAllTeams();
  const { mutate: deleteTeam } = useDeleteTeam();

  const [teamId, setTeamId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [team, setTeam] = useState<Team>();

  const handleTeamDelete = () => {
    deleteTeam(teamId);
  };

  const userTeams = teams?.filter(
    (team) => currentUser && team.users.includes(currentUser.id),
  );

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Box>
          <Typography sx={{ fontSize: 24 }}>Team Page</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setTeam(undefined);
              setIsOpen(true);
            }}
            sx={{ gap: 2 }}
          >
            Create Team
          </Button>
        </Box>

        {userTeams?.map((team, i) => (
          <TeamCard
            key={i}
            team={team}
            onEditClick={() => {
              setIsOpen(true);
              setTeam(team);
            }}
            onDeleteClick={() => {
              setTeamId(team.id);
              setIsOpenDeleteModal(true);
            }}
          />
        ))}

        <CreateUpdateTeamModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setTeam(undefined);
          }}
          team={team}
        />
      </Box>

      <AlertDialog
        title={"Delete team!"}
        message={"Are you sure you want to delete this team?"}
        open={isOpenDeleteModal}
        onClose={() => {
          setIsOpenDeleteModal(false);
        }}
        handleConfirm={handleTeamDelete}
      ></AlertDialog>
    </>
  );
};
