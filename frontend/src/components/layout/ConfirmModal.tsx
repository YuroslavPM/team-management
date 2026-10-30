import { useRef } from "react";

import { useDialogAccessibility } from "../../utils/hooks/useDialogAccessibility";
import { Button } from "../ui/Button";

type Props = {
  reason: string;
  onClick: () => void;
  onClose: () => void;
};

export function ConfirmModal(props: Props) {
  const { reason, onClick, onClose } = props;
  const dialogRef = useRef<HTMLDivElement>(null);

  const onSubmit = () => {
    onClick();
    onClose();
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
            Are you sure you want to {reason}
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

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Yes</Button>
        </div>
      </div>
    </div>
  );
}
