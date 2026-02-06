import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";

export interface TotalProjectsProps {
  sx?: SxProps;
  value: number | undefined;
}

export function TotalProjects({
  sx,
  value,
}: TotalProjectsProps): React.JSX.Element {
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
                Total Projects
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                bgcolor: "#0e83f0",
                height: 56,
                width: 56,
              }}
            >
              <AssignmentIcon fontSize="large" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
