import { Card, CardContent, Avatar, CardActions } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useGetAllUsers } from "../../../api/userController";
import { useGetAllTeams } from "../../../api/teams/teamController";
import type { Project } from "../../../api/projects/projectTypes";
import { useNavigate } from "react-router-dom";
import { CommonText } from "../../common/CommonText";
import { CommonButton } from "../../common/CommonButton";

export type ProjectCardProps = {
  project: Project;
  onEditClick: () => void;
  onDelete: () => void;
};

export const ProjectCard = ({
  project,
  onEditClick,
  onDelete,
}: ProjectCardProps) => {
  const { data: users } = useGetAllUsers();
  const { data: teams } = useGetAllTeams();
  const navigate = useNavigate();

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

        <CommonText
          text={""}
          value={project.name}
          variant={"h5"}
          style={null}
        />
        <CommonText
          text={"Status: "}
          style={null}
          variant={"body2"}
          value={project.status}
        />
        <CommonText
          text={"Members: "}
          value={users
            ?.filter((user) => project.memberIds.includes(user.id))
            .map((u) => u.first_name)
            .join(", ")}
          variant={"body2"}
          style={null}
        />

        <CommonText
          text={"Admins: "}
          value={users
            ?.filter((user) => project.adminIds.includes(user.id))
            .map((u) => u.first_name)
            .join(", ")}
          variant={"body2"}
          style={null}
        />
        <CommonText
          text={"Teams: "}
          value={teams
            ?.filter((team) => project.teamIds.includes(team.id))
            .map((t) => t.name)
            .join(", ")}
          variant={"body2"}
          style={null}
        />
      </CardContent>
      <CardActions>
        <CommonButton
          text={"Edit"}
          style={{ bgcolor: "#87CEEB", color: "white" }}
          size="small"
          onClick={onEditClick}
        />
        <CommonButton
          text={"Details"}
          style={{ bgcolor: "orange", color: "white" }}
          size="small"
          onClick={() => {
            navigate(`${project.id}`);
          }}
        />
        <CommonButton
          text={"Delete"}
          style={{ bgcolor: "red", color: "white" }}
          size="small"
          onClick={onDelete}
        />
      </CardActions>
    </Card>
  );
};
