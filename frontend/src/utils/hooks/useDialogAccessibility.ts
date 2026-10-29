import { type RefObject, useEffect } from "react";

export const useDialogAccessibility = (
  dialogRef: RefObject<HTMLDivElement | null>,
  onClose: () => void,
) => {
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
  }, [dialogRef, onClose]);
};
