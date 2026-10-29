import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useCreateProject } from "../../api/projects";
import { Button } from "../ui/Button";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Field } from "../ui/Field";

type PropsNewProjectForm = {
  onClose: () => void;
};

export function NewProjectForm(props: PropsNewProjectForm) {
  const { onClose } = props;

  const createProject = useCreateProject();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; description: string }>();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createProject.mutateAsync(values);
      navigate("/projects");
      onClose();
    } catch {
      // shown via createTeam.error
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      aria-label="New project"
      className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      {createProject.error && <ErrorAlert error={createProject.error} />}
      <Field
        label="Name"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />
      <Field label="Description" {...register("description")} />
      <div className="flex gap-2">
        <Button type="submit" disabled={createProject.isPending}>
          Create project
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            navigate("/projects");
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default NewProjectForm;
