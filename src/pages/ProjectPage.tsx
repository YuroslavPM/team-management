import { useState } from "react";
import {
  useDeleteProject,
  useGetAllProjects,
} from "../api/projects/projectController";
import { userAuthContext } from "../utils/context/UserContext";
import type { Project } from "../api/projects/projectTypes";
import { Box } from "@mui/material";
import { CreateUpdateProjectModal } from "../components/views/Projects/CreateUpdateProjectModal";
import { ProjectCard } from "../components/views/Projects/ProjectCard";
import { AlertDialog } from "../components/common/AlertDialog";
import { CommonButton } from "../components/common/CommonButton";
import { CommonText } from "../components/common/CommonText";

export const ProjectPage = () => {
  const { currentUser } = userAuthContext();

  const { data: projects } = useGetAllProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const [projectId, setProjectId] = useState<number>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [project, setProject] = useState<Project>();

  const handleTeamDelete = () => {
    deleteProject(projectId!);
  };

  const userProjects = projects?.filter((project) => {
    return (
      (currentUser &&
        project.admins.some((adminId) => adminId === currentUser.id)) ||
      project.members.some((memberId) => memberId === currentUser?.id)
    );
  });

  return (
    <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
      <Box>
        <CommonText
          text={"Project Page"}
          value={null}
          style={{ fontSize: 24 }}
        />
        <CommonButton
          text={"Create project"}
          style={{ bgcolor: "#2a70f3", color: "white", gap: 3 }}
          variant="contained"
          onClick={() => {
            setProject(undefined);
            setIsOpen(true);
          }}
        />
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
            setIsOpenDeleteModal(true);
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
      <AlertDialog
        title={"Delete project!"}
        message={"Are you sure you want to delete the project?"}
        open={isOpenDeleteModal}
        onClose={() => {
          setIsOpenDeleteModal(false);
        }}
        handleConfirm={handleTeamDelete}
      />
    </Box>
  );
};
