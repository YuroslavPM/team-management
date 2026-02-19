import {
  Card,
  CardContent,
  Avatar,
  CardActions,
  CardHeader,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deepOrange } from "@mui/material/colors";
import { useGetAllUsers } from "../../../api/userController";
import { useGetAllTeams } from "../../../api/teams/teamController";
import type { Project } from "../../../api/projects/projectTypes";
import dayjs from "dayjs";
import { CommonButton } from "../../common/CommonButton";
import { CommonText } from "../../common/CommonText";

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
          <CommonText
            text={""}
            value={project.name}
            variant={"h5"}
            style={{ fontWeight: "bold" }}
          />
        }
        subheader={
          <CommonText
            text={"Project created at: "}
            value={dayjs(project.created_at).format("DD/MM/YYYY")}
            variant={"body2"}
            style={null}
          />
        }
      ></CardHeader>
      <CardContent>
        <CommonText
          text={"Status: "}
          value={project.status}
          variant={"h5"}
          style={{ fontSize: 18 }}
        />
        <CommonText
          text={"Admins: "}
          value={users
            ?.filter((user) => project.adminIds.includes(user.id))
            .map((u) => u.first_name)
            .join(", ")}
          variant={"body2"}
          style={{ fontSize: 16, fontWeight: "bold" }}
        />
        <CommonText
          text={"Members: "}
          value={users
            ?.filter((user) => project.memberIds.includes(user.id))
            .map((u) => u.first_name)
            .join(", ")}
          variant={"body2"}
          style={{ fontSize: 16 }}
        />
        <CommonText
          text={"Teams: "}
          value={teams
            ?.filter((team) => project.teamIds.includes(team.id))
            .map((t) => t.name)
            .join(", ")}
          variant={"body2"}
          style={{ fontSize: 16 }}
        />
        <CommonText
          text={"Last update: "}
          value={dayjs(project.updated_at).format("DD/MM/YYYY")}
          variant={"body2"}
          style={{ fontSize: 14 }}
        />
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          alignItems: "right",
          justifyContent: "right",
          gap: 1,
        }}
      >
        <CommonButton
          text={"Edit"}
          style={{
            bgcolor: "#87CEEB",
            color: "white",
            width: 100,
            height: 45,
            fontSize: 16,
            fontWeight: "bold",
            boxShadow: 2,
          }}
          icon={<ModeEditIcon />}
          size="small"
          onClick={onEditClick}
        />
        <CommonButton
          text={"Delete"}
          style={{
            bgcolor: "red",
            color: "white",
            width: 100,
            height: 45,
            fontSize: 16,
            fontWeight: "bold",
            boxShadow: 2,
          }}
          size="small"
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
      </CardActions>
    </Card>
  );
};
