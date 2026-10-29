import { useRef, useState } from "react";

import { useAddProjectMember } from "../../api/projects";
import type { Project, ProjectRole } from "../../api/types";
import { useAllUsers } from "../../api/users";
import { useDialogAccessibility } from "../../utils/hooks/useDialogAccessibility";
import { Button } from "../ui/Button";
import { ErrorAlert } from "../ui/ErrorAlert";

type Props = {
  project: Project;
  onClose: () => void;
};

export function AddMemberDialog({ project, onClose }: Props) {
  const { data: users = [] } = useAllUsers();
  const addMember = useAddProjectMember(project.id);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<ProjectRole>("member");

  const dialogRef = useRef<HTMLDivElement>(null);

  const candidates = users.filter(
    (u) => !project.members.some((m) => m.userId === u.id),
  );

  const submit = () => {
    if (!userId) return;
    addMember.mutate({ userId: Number(userId), role }, { onSuccess: onClose });
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
            Add member
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

        {addMember.error && <ErrorAlert error={addMember.error} />}

        <div className="mt-2 space-y-4">
          <div>
            <label
              htmlFor="user-select"
              className="mb-1 text-sm font-medium text-slate-700"
            >
              User
            </label>
            <select
              id="user-select"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Choose someone…</option>
              {candidates.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="role-select"
              className="mb-1 text-sm font-medium text-slate-700"
            >
              Role
            </label>

            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as ProjectRole)}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!userId || addMember.isPending}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
