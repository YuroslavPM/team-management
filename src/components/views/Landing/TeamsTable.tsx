import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import type { SxProps } from "@mui/material/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export type TeamTablePayload = {
  id: string;
  name: string;
  updatedAt: Date;
};

export type LatestTeamsProps = {
  teams?: TeamTablePayload[];
  sx?: SxProps;
};

export const TeamsTable = ({ teams = [], sx }: LatestTeamsProps) => {
  const navigate = useNavigate();
  return (
    <Card sx={sx}>
      <CardHeader title="User teams" />
      <Divider />
      <List>
        {teams.map((team, index) => (
          <ListItem divider={index < teams.length - 1} key={team.id}>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: "#06c000",
                  height: 46,
                  width: 46,
                }}
              >
                <GroupIcon fontSize="large" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={team.name}
              secondary={`Updated ${dayjs(team.updatedAt).format("MMM D, YYYY")}`}
            />
            <IconButton edge="end">
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          onClick={() => {
            navigate("/teams");
          }}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};
