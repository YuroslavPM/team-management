import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box } from "@mui/material";

export type TasksProgressProps = {
  sx?: SxProps;
  value?: number;
};

export const TasksProgress = ({ sx, value }: TasksProgressProps) => {
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
              <Typography
                color="text.secondary"
                gutterBottom
                variant="overline"
              >
                Task Progress
              </Typography>
              <Typography variant="h4">{value}%</Typography>
            </Stack>
            <Avatar
              sx={{
                bgcolor: "#ececec",
                height: "56px",
                width: "56px",
              }}
            >
              <FormatListBulletedIcon
                sx={{ fontSize: 30, backgroundColor: "#ffa600" }}
              />
            </Avatar>
          </Stack>
          <Box>
            <LinearProgress value={value} variant="determinate" />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
