import { useState } from "react";
import { useGetAllProjects } from "../api/projects/projectController";
import { useGetAllTeams } from "../api/teams/teamController";
import { useGetAllUsers } from "../api/userController";
import { userAuthContext } from "../utils/context/UserContext";
import type { Project } from "../api/projects/projectTypes";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { CreateUpdateTeamModal } from "../components/views/Teams/CreateUpdateTeamModal";

export const ProjectPage = () => {
  const { currentUser } = userAuthContext();

  const { data: projects } = useGetAllProjects();
  const { data: teams } = useGetAllTeams();
  const { data: users } = useGetAllUsers();

  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project>();

  return (
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

      {/* Teams */}
      {userTeams?.map((team) => (
        <Card
          sx={{
            minWidth: 500,
            minHeight: 200,
            bgcolor: "#e7e9ee",
            width: "round(11px, 1px)",
          }}
          key={team.id}
        >
          <CardContent>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>
              {team?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" component="div">
              {team.name}
            </Typography>
            <Typography variant="body2">
              Mates:{" "}
              {users
                ?.filter((user) => team.users.includes(user.id))
                .map((u) => u.firstName)
                .join(", ")}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                setIsOpen(true);
                setTeam(team);
              }}
              sx={{
                bgcolor: "#87CEEB",
                color: "white",
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              sx={{
                bgcolor: "red",
                color: "white",
              }}
              onClick={() => {
                setTeamId(team.id);
                handleTeamDelete();
              }}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
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
  );
};
