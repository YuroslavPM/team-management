import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import { CreateUpdateTeamModal } from "../components/views/Teams/CreateUpdateTeamModal";
import { useDeleteTeam, useGetAllTeams } from "../api/teams/teamController";
import { userAuthContext } from "../utils/context/UserContext";
import type { Team } from "../api/teams/teamTypes";
import { AlertDialog } from "../components/common/AlertDialog";
import { CommonButton } from "../components/common/CommonButton";
import { CommonCard, type Column } from "../components/common/CommonCard";
import { deepOrange } from "@mui/material/colors";

type CardProps = {
  id: number;
};

export type TeamCardProps = {
  userDisplayName: string;
} & CardProps &
  Team;

const cols = <T extends TeamCardProps>(
  onEdit: (team: Team) => void,
  onDelete: (team: Team) => void,
): Column<T>[] => {
  return [
    {
      key: "logo",
      label: "Logo",
      renderRow: (_value, team: Team) => (
        <Box sx={{ display: "flex", gap: 2, marginBottom: 1}}>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>
            {team?.name.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      ),
    },

    { key: "name", label: "Team Name: " },
    { key: "userDisplayName", label: "Members: " },
    {
      key: "actions",
      label: "Actions",
      renderRow: (_value, team: Team) => (
        <Box sx={{ display: "flex", gap: 2, marginTop: 4 }}>
          <CommonButton
            text={"Edit"}
            style={{ bgcolor: "#87CEEB", color: "white" }}
            size="small"
            onClick={() => {
              onEdit(team);
            }}
          />

          <CommonButton
            text={"Delete"}
            style={{ bgcolor: "red", color: "white" }}
            size="small"
            onClick={() => onDelete(team)}
          />
        </Box>
      ),
    },
  ];
};

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

  const userCardTeams: TeamCardProps[] | undefined = userTeams?.map((team) => ({
    id: team.id,
    name: team.name,
    users: team.users,
    userDisplayName: team.users.map((u) => u.display_name).join(", "),
    updated_at: team.updated_at,
  }));

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
        <Box sx={{display: "flex", gap: 3}}>
        {userCardTeams?.map((team, i) => (
          <CommonCard
            key={i}
            cols={cols(
              (row) => {
                setIsOpen(true);
                setTeam(row);
              },
              (row) => {
                setTeamId(Number(row.id));
                setIsOpenDeleteModal(true);
              },
            )}
            rows={team}
          />
        ))}
        </Box>

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
