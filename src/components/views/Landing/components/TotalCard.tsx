import {
  type SxProps,
  Card,
  CardContent,
  Stack,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { getRandomColorByString } from "../../../../utils/helpers/randomColor";

export type TotalTeamsProps = {
  sx?: SxProps;
  value?: number;
  title: string;
  icon: React.ReactElement;
  };

export const TotalCard = ({
  sx,
  value,
  title,
  icon,
}: TotalTeamsProps) => {

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                bgcolor: getRandomColorByString(title),
                height: 56,
                width: 56,
              }}
            >
              <Box>{icon}</Box>
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
