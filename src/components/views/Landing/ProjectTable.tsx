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
import type { ProjectStatusTypes } from "../../../api/projects/projectEnum";
import { useNavigate } from "react-router-dom";

type ProjectTablePayload = {
  id: number;
  status: ProjectStatusTypes;
  name: string;
  admins: string;
  members: string;
};

export type LatestProjectsProps = {
  projects?: ProjectTablePayload[];
  sx?: SxProps;
};

export const ProjectTable = ({ projects = [], sx }: LatestProjectsProps) => {
  const navigate = useNavigate();

  return (
    <Card sx={sx}>
      <CardHeader title="User Projects" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Admins</TableCell>
              <TableCell>Members</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              return (
                <TableRow hover key={project.id}>
                  <TableCell>{project.status} </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.admins}</TableCell>
                  <TableCell>{project.members}</TableCell>
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
          onClick={() => {
            navigate("/projects");
          }}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};
