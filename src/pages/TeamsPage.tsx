import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { CreateUpdateTeamModal } from "../components/views/Teams/CreateUpdateTeamModal";
import { useDeleteTeam, useGetAllTeams } from "../api/teams/teamController";
import { userAuthContext } from "../utils/context/UserContext";
import type { Team } from "../api/teams/teamTypes";
import { TeamCard } from "../components/views/Teams/TeamCard";
import { AlertDialog } from "../components/common/AlertDialog";
import { CommonButton } from "../components/common/CommonButton";

export const TeamsPage = () => {
  const { currentUser } = userAuthContext();

  const { data: teams } = useGetAllTeams();
  const { mutate: deleteTeam } = useDeleteTeam();

  const [teamId, setTeamId] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [team, setTeam] = useState<Team>();

  const handleTeamDelete = () => {
    deleteTeam(teamId!);
  };

  const userTeams = teams?.filter((team) => {
    return currentUser && team.users.some((user) => user.id === currentUser.id);
  });

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Box>
          <Typography sx={{ fontSize: 24 }}>Team Page</Typography>
          <CommonButton
            text={"Create team"}
            style={{ bgcolor: "#2a70f3", color: "white", gap: 3 }}
            variant="contained"
            onClick={() => {
              setTeam(undefined);
              setIsOpen(true);
            }}
          />
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
              setTeamId(Number(team.id));
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
