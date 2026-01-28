import { Card, CardContent, Avatar, Typography, CardActions, Button } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import type { Project } from "../../../api/projects/projectTypes";
import { useGetAllUsers } from "../../../api/userController";
import { useGetAllTeams } from "../../../api/teams/teamController";

export type ProjectCardProps = {
  project: Project;
  onEditClick: ()=>void,
  onDelete: () => void;
};


export const ProjectCard = ({project,onEditClick,onDelete}:ProjectCardProps)=>{
  const { data: users } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();

    return (
      <Card
        sx={{
          minWidth: 500,
          minHeight: 200,
          bgcolor: "#e7e9ee",
          width: "round(11px, 1px)",
        }}
        key={project.id}
      >
        <CardContent>
          <Avatar sx={{ bgcolor: deepOrange[500] }}>
            {project?.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h5" component="div">
            {project.name}
          </Typography>
          <Typography variant="body2">Status: {project.status}</Typography>
          <Typography variant="body2">
            Admins:{" "}
            {users
              ?.filter((user) => project.adminIds.includes(user.id))
              .map((u) => u.firstName)
              .join(", ")}
          </Typography>
          <Typography variant="body2">
            Members:{" "}
            {users
              ?.filter((user) => project.memberIds.includes(user.id))
              .map((u) => u.firstName)
              .join(", ")}
          </Typography>
          <Typography variant="body2">
            {project.teamIds ?`Teams: ${teams?.filter((team)=> project.teamIds.includes(team.id))
            .map((t)=>t.name).join(", ")}`:""}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={onEditClick}
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
            onClick={onDelete}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    );

}