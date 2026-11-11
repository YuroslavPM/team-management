import { useRef, useState } from "react";

import { useCreateTask, useEditTask } from "../../api/tasks";
import {
  type Project,
  type Task,
  taskPriorityOptions,
  type TaskPriorityType,
  taskStatusOptions,
  type TaskStatusType,
} from "../../api/types";
import { useAuth } from "../../auth/authContext";
import { canProjectManage } from "../../utils/helpers/userHelpers";
import { useDialogAccessibility } from "../../utils/hooks/useDialogAccessibility";
import { Button } from "../ui/Button";
import { Combobox } from "../ui/Combobox";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Field } from "../ui/Field";

type Props = {
  mode: "create" | "edit" | "view";
  project: Project;
  task?: Task;
  onClose: () => void;
};

export function TaskDialog({ mode, project, task, onClose }: Props) {
  const { user } = useAuth();

  const createProjectTask = useCreateTask(project.id);
  const editTask = useEditTask(task?.id);

  const [taskTitle, setTaskTitle] = useState(task?.title || "");
  const [taskDescription, setTaskDescription] = useState(
    task?.description || "",
  );
  const [taskStatus, setTaskStatus] = useState<TaskStatusType>(
    task?.status || "todo",
  );
  const [taskPriority, setTaskPriority] = useState<TaskPriorityType>(
    task?.priority || "medium",
  );
  const [taskAssignee, setTaskAssignee] = useState<number | undefined>(
    task?.assigneeId ?? undefined,
  );
  const [taskDueDate, setTaskDueDate] = useState(
    task?.dueDate?.slice(0, 10) ?? "",
  );
  const [currentMode, setCurrentMode] = useState(mode);

  const canManage = canProjectManage(user!, project);
  const dialogRef = useRef<HTMLDivElement>(null);
  const capitalizeMode = currentMode[0].toUpperCase() + currentMode.slice(1);

  const modeLabels = {
    create: "Save",
    edit: "Save",
    view: "Edit",
  } as const;

  const projectMemberNames = project.members.map((m) => ({
    value: m.userId,
    label: m.displayName,
  }));

  const handleAction = () => {
    if (currentMode === "view") {
      setCurrentMode("edit");
      return;
    }

    submit();
  };

  const submit = () => {
    if (!taskTitle) return;
    const body = {
      title: taskTitle,
      description: taskDescription,
      status: taskStatus,
      priority: taskPriority,
      assigneeId: taskAssignee,
      dueDate: taskDueDate,
    };
    if (currentMode === "create") {
      createProjectTask.mutate(body, { onSuccess: onClose });
    } else {
      editTask.mutate(body, { onSuccess: onClose });
    }
  };

  useDialogAccessibility(dialogRef, onClose);
  
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div id="dialog-title" className="text-lg font-semibold">
            {capitalizeMode} task:
          </div>
          <button
            type="button"
            aria-label="Close"
            className="cursor-pointer text-xl leading-none text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {editTask.error && <ErrorAlert error={editTask.error} />}

        <div className="mt-2 space-y-4">
          <div>
            <Field
              label={"Title:"}
              disabled={currentMode === "view" || !canManage}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          <div>
            <Field
              label={"Description:"}
              disabled={currentMode === "view" || !canManage}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          <div>
            <Combobox<TaskStatusType>
              options={taskStatusOptions}
              value={taskStatus}
              disabled={currentMode === "view" || !canManage}
              onChange={(value) => {
                if (value) setTaskStatus(value);
              }}
              label={"Status:"}
              placeholder="Select a status..."
            />
          </div>
          <div>
            <Combobox<TaskPriorityType>
              options={taskPriorityOptions}
              value={taskPriority}
              disabled={currentMode === "view" || !canManage}
              onChange={(value) => {
                if (value) setTaskPriority(value);
              }}
              label={"Priority:"}
              placeholder="Select a status..."
            />
          </div>
          <div>
            <Combobox<number>
              options={projectMemberNames}
              value={taskAssignee}
              disabled={currentMode === "view" || !canManage}
              onChange={(value) => {
                if (value) setTaskAssignee(value);
              }}
              label={"Users:"}
              placeholder="Select a assignee..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Due date:
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={taskDueDate}
              disabled={currentMode === "view" || !canManage}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handleAction}
            disabled={!taskTitle || editTask.isPending}
          >
            {modeLabels[currentMode]}
          </Button>
        </div>
      </div>
    </div>
  );
}
