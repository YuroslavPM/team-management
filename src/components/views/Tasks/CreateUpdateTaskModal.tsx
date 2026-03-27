import { Controller, useForm } from "react-hook-form";
import {
  useCreateTask,
  useUpdateTask,
} from "../../../api/tasks/taskController";
import {
  PriorityStatus,
  TaskStatus,
  type PriorityStatusTypes,
  type TaskStatusTypes,
} from "../../../api/tasks/taskEnum";
import type { Task } from "../../../api/tasks/taskTypes";
import { useGetAllUsers } from "../../../api/userController";
import { useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  type SelectChangeEvent,
  Button,
} from "@mui/material";
import type { Project } from "../../../api/projects/projectTypes";
import type { User } from "../../../api/userTypes";
import { CommonText } from "../../common/CommonText";
import { CommonButton } from "../../common/CommonButton";

type CreateUpdateTaskProps = {
  open: boolean;
  task?: Task;
  project: Project;
  onClose: () => void;
};

type TaskForm = {
  title: string;
  description: string;
  status: TaskStatusTypes;
  priority: PriorityStatusTypes;
  project: number;
  assigned_user: User[];
};

export const CreateUpdateTaskModal = (props: CreateUpdateTaskProps) => {
  const { open, task, project, onClose } = props;

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { data: users = [] } = useGetAllUsers();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskForm>();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        project: project?.id,
        assigned_user: task.assigned_user.map((user) =>
          users.find((x) => x.id === user),
        ),
      });
    } else {
      reset({
        title: "",
        description: "",
        status: undefined,
        priority: undefined,
        project: project?.id,
        assigned_user: undefined,
      });
    }
  }, [users, task, project, reset]);

  const status = watch("status");
  const priority = watch("priority");

  const handleClick = (formData: TaskForm) => {
    if (!task) {
      createTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        project: project?.id,
        assigned_user:
          formData.assigned_user.map((user) => user.id ) || [],
      });
    } else {
      updateTask({
        id: task!.id,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        project: project?.id,
        assigned_user: formData.assigned_user.map((user) => user.id) || [],
      });
    }

    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component={"form"}
        onSubmit={handleSubmit((data) => handleClick(data))}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CommonText
          text={!task ? "Create Task" : "Edit Task"}
          value={null}
          variant={"h6"}
          style={null}
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Task title"
              error={!!errors.title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("title", event.target.value);
              }}
              placeholder="Fill name"
              defaultValue={task?.title}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Task description"
              error={!!errors.description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("description", event.target.value);
              }}
              placeholder="Fill description"
              multiline
              maxRows={4}
              defaultValue={task?.description}
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                {...field}
                value={status!}
                label="Status"
                onChange={(event: SelectChangeEvent) => {
                  setValue("status", event.target.value as TaskStatusTypes);
                }}
              >
                {Object.values(TaskStatus).map((s) => (
                  <MenuItem value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Priority</InputLabel>
              <Select
                {...field}
                value={priority!}
                label="Priority"
                onChange={(event: SelectChangeEvent) => {
                  setValue(
                    "priority",
                    event.target.value as PriorityStatusTypes,
                  );
                }}
              >
                {Object.values(PriorityStatus).map((s) => (
                  <MenuItem value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="assigned_user"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={users.filter(
                (user) =>
                  project?.admins?.includes?.(user.id) ||
                  project?.members?.includes?.(user.id),
              )}
              getOptionLabel={(option) => option.first_name}
              onChange={(_e, value) => {
                setValue("assigned_user", value);
              }}
              renderValue={(values, getItemProps) =>
                values.map((option, index) => {
                  const { key, ...itemProps } = getItemProps({ index });
                  return (
                    <Chip key={key} label={option.first_name} {...itemProps} />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assigned members"
                  placeholder="Task members"
                />
              )}
            />
          )}
        />
        <Button variant="contained" type="submit">
          {!task ? "Create" : "Edit"}
        </Button>

        <CommonButton
          text={"Close"}
          style={{ bgcolor: "#2a70f3", color: "white" }}
          variant="contained"
          onClick={onClose}
        />
      </Box>
    </Modal>
  );
};
