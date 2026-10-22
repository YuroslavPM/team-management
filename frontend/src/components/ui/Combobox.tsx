import type { KeyboardEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";

export type ComboboxOption<T extends string = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type ComboboxProps<T extends string = string> = {
  options: ComboboxOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function Combobox<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  label = "Select an option",
  disabled = false,
  allowClear = false,
  className = "",
}: ComboboxProps<T>) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  const [inputValue, setInputValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);

  const query = inputValue ?? "";

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const displayValue = inputValue ?? selectedOption?.label ?? "";

  const activeOption = filteredOptions.find(
    (option) => option.value === activeValue && !option.disabled,
  );

  function closeDropdown() {
    setOpen(false);
    setActiveValue(null);
    setInputValue(null);
  }

  function selectOption(option: ComboboxOption<T>) {
    if (option.disabled) return;

    onChange(option.value);
    setInputValue(null);
    setActiveValue(null);
    setOpen(false);
  }

  function clearSelection() {
    onChange(null);
    setInputValue("");
    setActiveValue(null);
    setOpen(true);
    inputRef.current?.focus();
  }

  function moveActiveOption(direction: 1 | -1) {
    const enabledOptions = filteredOptions.filter((option) => !option.disabled);

    if (enabledOptions.length === 0) {
      setActiveValue(null);
      return;
    }

    const currentIndex = enabledOptions.findIndex(
      (option) => option.value === activeValue,
    );

    const nextIndex =
      currentIndex === -1
        ? direction === 1
          ? 0
          : enabledOptions.length - 1
        : (currentIndex + direction + enabledOptions.length) %
          enabledOptions.length;

    setActiveValue(enabledOptions[nextIndex].value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        if (!open) {
          setOpen(true);
          setActiveValue(null);
          return;
        }

        moveActiveOption(1);
        break;

      case "ArrowUp":
        event.preventDefault();

        if (!open) {
          setOpen(true);
          setActiveValue(null);
          return;
        }

        moveActiveOption(-1);
        break;

      case "Enter":
        if (open) {
          event.preventDefault();

          if (activeOption) {
            selectOption(activeOption);
          }
        }
        break;

      case "Escape":
        if (open) {
          event.preventDefault();
          closeDropdown();
        }
        break;

      case "Tab":
        closeDropdown();
        break;
    }
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!open || !activeValue) return;

    const activeElement = document.getElementById(
      `${id}-option-${encodeURIComponent(activeValue)}`,
    );

    activeElement?.scrollIntoView({ block: "nearest" });
  }, [activeValue, open, id]);

  return (
    <div ref={rootRef} className={`combobox ${className}`.trim()}>
      <label className="combobox__label" htmlFor={`${id}-input`}>
        {label}
      </label>

      <div className="combobox__control">
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-activedescendant={
            open && activeOption
              ? `${id}-option-${encodeURIComponent(activeOption.value)}`
              : undefined
          }
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(event) => {
            setInputValue(event.target.value);
            setOpen(true);
            setActiveValue(null);

            if (value !== null) {
              onChange(null);
            }
          }}
          onKeyDown={handleKeyDown}
          className="combobox__input"
        />

        {allowClear && value !== null && !disabled && (
          <button
            type="button"
            className="combobox__clear"
            aria-label="Clear selection"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearSelection}
          >
            ×
          </button>
        )}

        <button
          type="button"
          className="combobox__toggle"
          aria-label={open ? "Close options" : "Open options"}
          aria-expanded={open}
          disabled={disabled}
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (open) {
              closeDropdown();
            } else {
              setInputValue(null);
              setActiveValue(null);
              setOpen(true);
              inputRef.current?.focus();
            }
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && !disabled && (
        <ul
          ref={listboxRef}
          id={`${id}-listbox`}
          role="listbox"
          aria-label={label}
          className="combobox__listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isActive = option.value === activeValue;
              const isSelected = option.value === value;
              const optionId = `${id}-option-${encodeURIComponent(option.value)}`;

              return (
                <li
                  id={optionId}
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  className={[
                    "combobox__option",
                    isActive ? "combobox__option--active" : "",
                    isSelected ? "combobox__option--selected" : "",
                    option.disabled ? "combobox__option--disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseMove={() => {
                    if (!option.disabled) {
                      setActiveValue(option.value);
                    }
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                >
                  <span>{option.label}</span>

                  {isSelected && <span aria-hidden="true">✓</span>}
                </li>
              );
            })
          ) : (
            <li className="combobox__empty" role="status">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
