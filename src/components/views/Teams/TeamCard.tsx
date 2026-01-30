import {
  Card,
  CardContent,
  Avatar,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import type { Team } from "../../../api/teams/teamTypes";
import { useGetAllUsers } from "../../../api/userController";
import { CommonText } from "../../common/CommonText";

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
        <Typography variant="h5" component="div">
          {team.name}
        </Typography>
        <CommonText
          text={"Mates:"}
          value={users
            ?.filter((user) => team.users.includes(user.id))
            .map((u) => u.firstName)
            .join(", ")}
          variant={"body2"} style={null}        />
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
          onClick={onDeleteClick}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
