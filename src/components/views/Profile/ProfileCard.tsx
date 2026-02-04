import { Card, CardContent, Avatar, CardActions } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import dayjs from "dayjs";
import { getDisplayName } from "../../../utils/helpers/getDisplayName";
import { CommonButton } from "../../common/CommonButton";
import { CommonText } from "../../common/CommonText";
import type { User } from "../../../api/userTypes";

type ProfileCardPayload = {
  user: User | undefined;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export const ProfileCard = (props: ProfileCardPayload) => {
  const { user, onEditClick, onDeleteClick } = props;

  return (
    <Card
      sx={{
        minWidth: 500,
        minHeight: 200,
        bgcolor: "#e7e9ee",
        width: "round(11px, 1px)",
      }}
    >
      <CardContent>
        <CommonText
          text={"Welcome "}
          value={" " + getDisplayName(user) + "!"}
          style={{ color: "text.secondary", fontSize: 16 }}
          gutterBottom
        />
        <Avatar sx={{ bgcolor: deepOrange[500] }}>
          {user?.firstName.charAt(0)}
        </Avatar>
        <CommonText
          text={""}
          value={user?.firstName}
          variant={"h5"}
          style={null}
        />
        <CommonText
          text={"E-mail: "}
          value={user?.email}
          variant={"body2"}
          style={null}
        />
        <CommonText
          text={"You are here since: "}
          value={dayjs(user?.createdAt).format("DD/MM/YYYY")}
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
          text={"Delete"}
          style={{ bgcolor: "red", color: "white" }}
          size="small"
          onClick={onDeleteClick}
        />
      </CardActions>
    </Card>
  );
};
