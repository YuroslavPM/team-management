import { useEffect, useRef, useState } from "react";

import { errorMessage } from "../../api/errors";
import { useAddTeamMember } from "../../api/teams";
import type { Team, TeamRole } from "../../api/types";
import { useAllUsers } from "../../api/users";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";

type Props = {
  team: Team;
  onClose: () => void;
};

export function AddMemberDialog({ team, onClose }: Props) {
  const { data: users = [] } = useAllUsers();
  const addMember = useAddTeamMember(team.id);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<TeamRole>("member");

  const dialogRef = useRef<HTMLDivElement>(null);

  const candidates = users.filter(
    (u) => !team.members.some((m) => m.userId === u.id),
  );

  const submit = () => {
    if (!userId) return;
    addMember.mutate({ userId: Number(userId), role }, { onSuccess: onClose });
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

        {addMember.error && <Alert>{errorMessage(addMember.error)}</Alert>}

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
              onChange={(e) => setRole(e.target.value as TeamRole)}
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="member">Member</option>
              <option value="lead">Lead</option>
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
