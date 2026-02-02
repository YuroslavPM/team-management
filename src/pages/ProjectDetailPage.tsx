import { useState } from "react";
import {
  useDeleteProject,
  useGetAllProjects,
} from "../api/projects/projectController";
import type { Project } from "../api/projects/projectTypes";
import { Box } from "@mui/material";
import { CreateUpdateProjectModal } from "../components/views/Projects/CreateUpdateProjectModal";
import { ProjectCardDetails } from "../components/views/Projects/ProjectCardDetails";
import { useParams } from "react-router-dom";
import { AlertDialog } from "../components/common/AlertDialog";
import { TaskTable } from "../components/views/Tasks/TaskTable";
import { useGetAllTasks, useDeleteTask } from "../api/tasks/taskController";
import type { Task } from "../api/tasks/taskTypes";
import { CreateUpdateTaskModal } from "../components/views/Tasks/CreateUpdateTaskModal";
import { CommonText } from "../components/common/CommonText";
import { CommonButton } from "../components/common/CommonButton";

export const ProjectDetailPage = () => {
  const { data: tasks } = useGetAllTasks();
  const { data: getProjects } = useGetAllProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: deleteTask } = useDeleteTask();

  const { id } = useParams();
  const [taskId, setTaskId] = useState("");
  const [task, setTask] = useState<Task>();
  const userTasks = tasks?.filter((task) => task.projectId === id);
  const [isOpenProjectModal, setIsOpen] = useState(false);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [isOpenProjectDeleteModal, setIsOpenProjectDeleteModal] =
    useState(false);
  const [isOpenTaskDeleteModal, setIsOpenTaskDeleteModal] = useState(false);
  const [project, setProject] = useState<Project | undefined>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    getProjects?.find((project) => project.id === id)!,
  );

  const handleTeamDelete = () => {
    deleteProject(id!);
  };

  const handleTaskDelete = () => {
    deleteTask(taskId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: "column",
        minWidth: "100%",
      }}
    >
      <Box>
        <CommonText
          text={"Detail Product Page"}
          value={null}
          style={{ fontSize: 24, fontWeight: "bold" }}
        />
      </Box>
      <ProjectCardDetails
        project={project!}
        onEditClick={() => {
          setIsOpen(true);
          setProject(project);
        }}
        onDelete={() => {
          setIsOpenProjectDeleteModal(true);
        }}
      />
      <CommonText
        text={"Tasks for the project"}
        value={null}
        style={{ fontSize: 24, fontWeight: "bold" }}
      />
      <CommonButton
        text={"Create task"}
        style={{
          gap: 3,
          boxShadow: 3,
          width: 160,
          bgcolor: "#2a70f3",
          color: "white",
        }}
        onClick={() => {
          setTask(undefined);
          setIsOpenTaskModal(true);
        }}
      />
      <Box sx={{ minWidth: 1 }}>
        {userTasks?.map((task, i) => (
          <TaskTable
            key={i}
            task={task}
            onEditClick={() => {
              setIsOpenTaskModal(true);
              setTask(task);
            }}
            onDelete={() => {
              setTaskId(task.id);
              setIsOpenTaskDeleteModal(true);
            }}
          />
        ))}
      </Box>
      <CreateUpdateProjectModal
        open={isOpenProjectModal}
        onClose={() => {
          setIsOpen(false);
          setProject(undefined);
        }}
        project={project}
      />
      <CreateUpdateTaskModal
        open={isOpenTaskModal}
        onClose={() => {
          setIsOpenTaskModal(false);
          setTask(undefined);
        }}
        task={task}
        project={project!}
      />
      <AlertDialog
        title={isOpenProjectDeleteModal ? "Delete Project!" : "Delete Task!"}
        message={
          isOpenProjectDeleteModal
            ? "Are you sure you want to delete the project?"
            : "Are you sure you want to delete the task?"
        }
        open={
          isOpenProjectDeleteModal
            ? isOpenProjectDeleteModal
            : isOpenTaskDeleteModal
        }
        onClose={() => {
          if (isOpenProjectDeleteModal) {
            setIsOpenProjectDeleteModal(false);
          } else {
            setIsOpenTaskDeleteModal(false);
          }
        }}
        handleConfirm={
          isOpenProjectDeleteModal ? handleTeamDelete : handleTaskDelete
        }
      />
    </Box>
  );
};
