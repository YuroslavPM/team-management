import {
  Card,
  CardContent,
  Avatar,
  CardActions,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import type { Team } from "../../../api/teams/teamTypes";
import { useGetAllUsers } from "../../../api/userController";
import { CommonText } from "../../common/CommonText";
import { CommonButton } from "../../common/CommonButton";

type TeamCardProps = {
  team: Team;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export const TeamCard = ({
  team,
  onEditClick,
  onDeleteClick,
}: TeamCardProps) => {
  const { data: users } = useGetAllUsers();

  return (
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
        <CommonText
          value={team.name}
          variant={"h5"}
        />
        <CommonText
          text={"Mates:"}
          value={users
            ?.filter((user) => team.users.some((teamUsers)=> teamUsers.id === user.id))
            .map((u) => u.first_name)
            .join(", ")}
          variant={"body2"}
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
          text={"Delete"}
          style={{ bgcolor: "red", color: "white" }}
          size="small"
          onClick={onDeleteClick}
        />
      </CardActions>
    </Card>
  );
};
