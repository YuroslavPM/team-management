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
} from "@mui/material";
import { CommonButton } from "../../common/CommonButton";

export type TaskTableProps = {
  tasks: Task[];
  onEditClick: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export const TaskTable = ({ tasks, onEditClick, onDelete }: TaskTableProps) => {
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
          {tasks.map((task) => (
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
                  ?.filter((user) => task.assigned_user.includes(user.id))
                  .map((u) => u.first_name)
                  .join(", ")}
              </TableCell>
              <TableCell align="center" sx={{ gap: 1, display: "flex" }}>
                <CommonButton
                  text={"Edit"}
                  style={{ bgcolor: "#87CEEB", color: "white" }}
                  size="small"
                  onClick={() => onEditClick(task)}
                />
                <CommonButton
                  text={"Delete"}
                  style={{ bgcolor: "red", color: "white" }}
                  size="small"
                  onClick={() => onDelete(task)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
