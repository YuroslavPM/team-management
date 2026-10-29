import { useRef, useState } from "react";

import { useEditProject } from "../../api/projects";
import type { Project } from "../../api/types";
import { useDialogAccessibility } from "../../utils/hooks/useDialogAccessibility";
import { Button } from "../ui/Button";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Field } from "../ui/Field";

type Props = {
  project: Project;
  onClose: () => void;
};

export function EditProjectDialog({ project, onClose }: Props) {
  const editProject = useEditProject(project.id);
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description,
  );

  const dialogRef = useRef<HTMLDivElement>(null);

  const submit = () => {
    if (!projectName) return;
    editProject.mutate(
      { name: projectName, description: projectDescription },
      { onSuccess: onClose },
    );
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
            Edit project:
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

        {editProject.error && <ErrorAlert error={editProject.error} />}

        <div className="mt-2 space-y-4">
          <div>
            <Field
              label={"Project name:"}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div>
            <Field
              label={"Project description:"}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!projectName || editProject.isPending}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
