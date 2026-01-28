import { useState } from "react";
import {
  useDeleteProject,
  useGetAllProjects,
} from "../api/projects/projectController";
import { userAuthContext } from "../utils/context/UserContext";
import type { Project } from "../api/projects/projectTypes";
import { Box, Button, Typography } from "@mui/material";
import { CreateUpdateProjectModal } from "../components/views/Projects/CreateUpdateProjectModal";
import { ProjectCard } from "../components/views/Projects/ProjectCard";

export const ProjectPage = () => {
  const { currentUser } = userAuthContext();

  const { data: projects } = useGetAllProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const [projectId, setProjectId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project>();

  const handleTeamDelete = () => {
    deleteProject(projectId);
  };

  const userProjects = projects?.filter(
    (project) =>
      (currentUser && project.adminIds.includes(currentUser.id)) ||
      project.memberIds.includes(currentUser!.id),
  );

  return (
    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      <Box>
        <Typography sx={{ fontSize: 24 }}>Project Page</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setProject(undefined);
            setIsOpen(true);
          }}
          sx={{ gap: 3 }}
        >
          Create Project
        </Button>
      </Box>

      {userProjects?.map((project, i) => (
        <ProjectCard
          key={i}
          project={project}
          onEditClick={() => {
            setIsOpen(true);
            setProject(project);
          }}
          onDelete={() => {
            setProjectId(project.id);
            handleTeamDelete();
          }}
        />
      ))}

      <CreateUpdateProjectModal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setProject(undefined);
        }}
        project={project}
      />
    </Box>
  );
};
