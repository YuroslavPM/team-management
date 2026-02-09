import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import dayjs from "dayjs";
import type {
  PriorityStatusTypes,
  TaskStatusTypes,
} from "../../../api/tasks/taskEnum";

type TaskTablePayload = {
  id: string;
  status: TaskStatusTypes;
  title: string;
  priority: PriorityStatusTypes;
  project: string;
  updatedAt: Date;
};

export type LatestOrdersProps = {
  tasks?: TaskTablePayload[];
  sx?: SxProps;
};

export const TaskTable = ({ tasks = [], sx }: LatestOrdersProps) => {
  return (
    <Card sx={sx}>
      <CardHeader title="User Tasks" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Project</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              return (
                <TableRow hover key={task.id}>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>
                    {dayjs(task.updatedAt).format("MMM D, YYYY")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="medium" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};
