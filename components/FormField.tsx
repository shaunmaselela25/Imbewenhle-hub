import { useId, type ReactNode } from "react";
import { messages } from "@/lib/copy/messages";

export const fieldClasses =
  "w-full rounded-md border border-border bg-surface px-4 text-base text-text aria-invalid:border-error";

export type FieldCounter = { text: string; outOfRange: boolean };

type ControlProps = {
  id: string;
  required?: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  counter?: FieldCounter;
  children: (control: ControlProps) => ReactNode;
};

export function FormField({ label, required, error, counter, children }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;
  const describedBy = [error && errorId, counter && counterId].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-text">
        {label}
        {required && <span aria-hidden="true"> {messages["form.required"]}</span>}
      </label>
      {children({
        id,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {error && (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      )}
      {counter && (
        <p
          id={counterId}
          className={`text-xs ${counter.outOfRange ? "text-error" : "text-text-muted"}`}
        >
          {counter.text}
        </p>
      )}
    </div>
  );
}
