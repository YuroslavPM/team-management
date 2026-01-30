import {
  Card,
  CardContent,
  Avatar,
  Typography,
  CardActions,
  Button,
  CardHeader,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deepOrange } from "@mui/material/colors";
import { useGetAllUsers } from "../../../api/userController";
import { useGetAllTeams } from "../../../api/teams/teamController";
import type { Project } from "../../../api/projects/projectTypes";
import dayjs from "dayjs";

export type ProjectCardProps = {
  project: Project;
  onEditClick: () => void;
  onDelete: () => void;
};

export const ProjectCardDetails = ({
  project,
  onEditClick,
  onDelete,
}: ProjectCardProps) => {
  const { data: users } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();

  return (
    <Card
      sx={{
        minWidth: 500,
        minHeight: 280,
        bgcolor: "#e7e9ee",
        width: 1,
        boxShadow: 3,
        fontFamily: "Arial",
      }}
      key={project.id}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
              height: 50,
              width: 50,
              fontWeight: "bold",
              fontSize: 26,
            }}
          >
            {project?.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {project.name}
          </Typography>
        }
        subheader={
          <Typography variant="body2">
            Project created at: {dayjs(project.createdAt).format("DD/MM/YYYY")}
          </Typography>
        }
      ></CardHeader>
      <CardContent>
        <Typography variant="body2" sx={{ fontSize: 18 }}>
          Status: {project.status}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 16, fontWeight: "bold" }}>
          Admins:{" "}
          {users
            ?.filter((user) => project.adminIds.includes(user.id))
            .map((u) => u.firstName)
            .join(", ")}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 16 }}>
          Members:{" "}
          {users
            ?.filter((user) => project.memberIds.includes(user.id))
            .map((u) => u.firstName)
            .join(", ")}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 16 }}>
          {project.teamIds
            ? `Teams: ${teams
                ?.filter((team) => project.teamIds.includes(team.id))
                .map((t) => t.name)
                .join(", ")}`
            : ""}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 14 }}>
          Last update: {dayjs(project.updatedAt).format("DD/MM/YYYY")}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          alignItems: "right",
          justifyContent: "right",
          gap: 1,
        }}
      >
        <Button
          size="small"
          onClick={onEditClick}
          startIcon={<ModeEditIcon />}
          sx={{
            bgcolor: "#87CEEB",
            color: "white",
            width: 100,
            height: 45,
            fontSize: 16,
            fontWeight: "bold",
            boxShadow: 2,
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          sx={{
            bgcolor: "red",
            color: "white",
            width: 100,
            height: 45,
            fontSize: 16,
            fontWeight: "bold",
            boxShadow: 2,
          }}
          onClick={onDelete}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
