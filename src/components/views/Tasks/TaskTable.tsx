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
import { useEffect, useState } from "react";
import type { PriorityStatusTypes } from "../../../api/tasks/taskEnum";

export type TaskTableProps = {
  tasks: Task[];
  onEditClick: () => void;
  onDelete: () => void;
};

type TaskTableRows = {
  title: string;
  description: string;
  priority: PriorityStatusTypes;
  assignedUserId: string[];
  created_at: Date;
};

export const TaskTable = ({ tasks, onEditClick, onDelete }: TaskTableProps) => {
  const { data: users } = useGetAllUsers();
  const [rows, setRows] = useState<TaskTableRows[]>([]);

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

  useEffect(() => {
    const data = tasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedUserId: task.assignedUserId,
      created_at: task.created_at,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRows(data);
  }, [tasks]);

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
          {rows.map((row) => (
            <TableRow
              key={row.title}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" style={rowStyle}>
                {row.title}
              </TableCell>
              <TableCell align="center" style={rowStyle}>
                {row.description}
              </TableCell>
              <TableCell align="center" style={rowStyle}>
                {row.priority}
              </TableCell>
              <TableCell align="center" style={rowStyle}>
                {dayjs(row.created_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell align="center" style={rowStyle}>
                {users
                  ?.filter((user) => row.assignedUserId.includes(user.id))
                  .map((u) => u.first_name)
                  .join(", ")}
              </TableCell>
              <TableCell align="center" sx={{ gap: 1, display: "flex" }}>
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
                  onClick={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
