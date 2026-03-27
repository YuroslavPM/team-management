import {
  type SxProps,
  Card,
  CardContent,
  Stack,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

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

const stringToColor = (input: string ) => {

    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 55%)`;
  };

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
                bgcolor: stringToColor(title),
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
