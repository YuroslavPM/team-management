import { useState, type JSX } from "react";
import {
  useDeleteProject,
  useGetAllProjects,
} from "../api/projects/projectController";
import { Box, type SxProps } from "@mui/material";
import { CreateUpdateProjectModal } from "../components/views/Projects/CreateUpdateProjectModal";
import { ProjectCardDetails } from "../components/views/Projects/ProjectCardDetails";
import { useParams } from "react-router-dom";
import { AlertDialog } from "../components/common/AlertDialog";
import { useGetAllTasks, useDeleteTask } from "../api/tasks/taskController";
import type { Task } from "../api/tasks/taskTypes";
import { CreateUpdateTaskModal } from "../components/views/Tasks/CreateUpdateTaskModal";
import { CommonText } from "../components/common/CommonText";
import { CommonButton } from "../components/common/CommonButton";
import { CommonTable } from "../components/common/CommonTable";
import dayjs from "dayjs";
import { useGetAllUsers } from "../api/userController";
import type { User } from "../api/userTypes";

type TableProps = {
  id: string | number;
};

type TaskTable = {
  assignedNames: string | undefined;
} & TableProps &
  Task;

type Column<T> = {
  key: string;
  label: string;
  columnStyle?: SxProps;
  renderRow?: (value: keyof T, row: T) => JSX.Element;
};

const cols = <T extends TaskTable>(
  onEdit: (row: TaskTable) => void,
  onDelete: (id: number) => void,
): Column<T>[] => {
  return [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "priority",
      label: "Priority",
    },
    {
      key: "created_at",
      label: "Assigned at",
    },
    {
      key: "assignedNames",
      label: "Assigned to",
    },
    {
      key: "actions",
      label: "Actions",
      renderRow: (_value, row) => (
        <Box sx={{ display: "flex", gap: 2 }}>
          <CommonButton
            text={"Edit"}
            style={{ bgcolor: "#87CEEB", color: "white" }}
            size="small"
            onClick={() => {
              onEdit(row);
            }}
          />

          <CommonButton
            text={"Delete"}
            style={{ bgcolor: "red", color: "white" }}
            size="small"
            onClick={() => onDelete(row.id)}
          />
        </Box>
      ),
    },
  ];
};

export const ProjectDetailPage = () => {
  const { data: tasks } = useGetAllTasks();
  const { data: users } = useGetAllUsers();
  const { data: getProjects } = useGetAllProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: deleteTask } = useDeleteTask();

  const { id } = useParams();
  const [taskId, setTaskId] = useState<number>();
  const [task, setTask] = useState<TaskTable>();
  const userTasks = tasks?.filter((task) => task.project === Number(id)) || [];

  const userTasksRows: TaskTable[] = userTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    project: task.project,
    assigned_user: task.assigned_user,
    assignedNames: users
      ?.filter((user: User) => task.assigned_user.includes(user.id))
      .map((u) => u.first_name)
      .join(", "),
    created_at: dayjs(task.created_at).format("DD/MM/YYYY") || "",
    updated_at: dayjs(task.updated_at).format("DD/MM/YYYY") || "",
  }));

  const [isOpenProjectModal, setIsOpen] = useState(false);
  const [isOpenTaskModal, setIsOpenTaskModal] = useState(false);
  const [isOpenProjectDeleteModal, setIsOpenProjectDeleteModal] =
    useState(false);
  const [isOpenTaskDeleteModal, setIsOpenTaskDeleteModal] = useState(false);

  const currentProject = getProjects?.find(
    (project) => project.id === Number(id),
  );

  const handleTeamDelete = () => {
    deleteProject(Number(id));
  };

  const handleTaskDelete = () => {
    deleteTask(taskId!);
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
          style={{ fontSize: 24, fontWeight: "bold" }}
        />
      </Box>
      <ProjectCardDetails
        project={currentProject!}
        onEditClick={() => {
          setIsOpen(true);
        }}
        onDelete={() => {
          setIsOpenProjectDeleteModal(true);
        }}
      />
      <CommonText
        text={"Tasks for the project"}
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

      {userTasks && (
        <CommonTable
          cols={cols(
            (row) => {
              setIsOpenTaskModal(true);
              setTask(row);
            },
            (id) => {
              setIsOpenTaskDeleteModal(true);
              setTaskId(id);
            },
          )}
          rows={userTasksRows}
        />
      )}
      <CreateUpdateProjectModal
        open={isOpenProjectModal}
        onClose={() => {
          setIsOpen(false);
        }}
        project={currentProject}
      />
      <CreateUpdateTaskModal
        open={isOpenTaskModal}
        onClose={() => {
          setIsOpenTaskModal(false);
          setTask(undefined);
        }}
        task={task}
        project={currentProject!}
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
