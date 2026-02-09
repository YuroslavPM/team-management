import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import GroupIcon from "@mui/icons-material/Group";

export type TotalTeamsProps = {
  sx?: SxProps;
  value: number | undefined;
};

export const TotalTeams = ({ sx, value }: TotalTeamsProps) => {
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
                Total Teams
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                bgcolor: "#06c000",
                height: 56,
                width: 56,
              }}
            >
              <GroupIcon fontSize="large" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
