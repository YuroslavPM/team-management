import dayjs from "dayjs";
import type { Task } from "../../../api/tasks/taskTypes";
import { useGetAllUsers } from "../../../api/userController";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

export type TaskTableProps = {
  task: Task;
  onEditClick: () => void;
  onDelete: () => void;
};

export const TaskTable = ({ task, onEditClick, onDelete }: TaskTableProps) => {
  const { data: users } = useGetAllUsers();

  const cellStyle = {
    fontWeight: 700,
    color: "white",
    textShadow: "1px 1px 1px gray",
    fontSize: "16px",
  };
  const rowStyle = {
    color: "black",
    fontSize: "15px",
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: 1, boxShadow: 3 }} aria-label="simple table">
        <TableHead
          style={{
            backgroundColor: "#48cae4",
            fontWeight: "bold",
          }}
        >
          <TableRow>
            <TableCell align="center" style={cellStyle}>
              Title
            </TableCell>
            <TableCell align="center" style={cellStyle}>
              Description
            </TableCell>
            <TableCell align="center" style={cellStyle}>
              Priority
            </TableCell>
            <TableCell align="center" style={cellStyle}>
              Assigned at
            </TableCell>
            <TableCell align="center" style={cellStyle}>
              Assigned to
            </TableCell>
            <TableCell align="center" style={cellStyle}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            key={task.title}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row" style={rowStyle}>
              {task.title}
            </TableCell>
            <TableCell align="center" style={rowStyle}>
              {task.description}
            </TableCell>
            <TableCell align="center" style={rowStyle}>
              {task.priority}
            </TableCell>
            <TableCell align="center" style={rowStyle}>
              {dayjs(task.created_at).format("DD/MM/YYYY")}
            </TableCell>
            <TableCell align="center" style={rowStyle}>
              {users
                ?.filter((user) => task.assignedUserId.includes(user.id))
                .map((u) => u.firstName)
                .join(", ")}
            </TableCell>
            <TableCell align="center" sx={{ gap: 1, display: "flex" }}>
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
                onClick={onDelete}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
