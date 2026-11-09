"use client";

import type { ComponentProps } from "react";
import { fieldClasses, FormField } from "./FormField";
import { useCharacterCounter } from "./useCharacterCounter";

type TextFieldProps = Omit<ComponentProps<"input">, "type" | "id" | "min" | "max"> & {
  label: string;
  name: string;
  type?: "text" | "email";
  error?: string;
  min?: number;
  max?: number;
};

export function TextField({
  label,
  type = "text",
  required,
  error,
  min,
  max,
  value,
  defaultValue,
  onChange,
  ...props
}: TextFieldProps) {
  const { counter, handleChange } = useCharacterCounter({ value, defaultValue, onChange, min, max });

  return (
    <FormField label={label} required={required} error={error} counter={counter}>
      {(control) => (
        <input
          {...props}
          {...control}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`${fieldClasses} min-h-button`}
        />
      )}
    </FormField>
  );
}
