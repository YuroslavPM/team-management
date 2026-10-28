import { useEffect, useRef, useState } from "react";

import { errorMessage } from "../../api/errors";
import { useEditProject } from "../../api/projects";
import type { Project } from "../../api/types";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
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

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const previousFocus = document.activeElement as HTMLElement | null;

    const getFocusableElements = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );

    const focusableElements = getFocusableElements();

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (е: KeyboardEvent) => {
      if (е.key === "Escape") {
        е.preventDefault();
        onClose();
        return;
      }

      if (е.key !== "Tab") {
        return;
      }

      const elements = getFocusableElements();

      if (elements.length === 0) {
        е.preventDefault();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (е.shiftKey) {
        if (document.activeElement === firstElement) {
          е.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        е.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

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

        {editProject.error && <Alert>{errorMessage(editProject.error)}</Alert>}

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
