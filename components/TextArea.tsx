"use client";

import type { ComponentProps } from "react";
import { fieldClasses, FormField } from "./FormField";
import { useCharacterCounter } from "./useCharacterCounter";

type TextAreaProps = Omit<ComponentProps<"textarea">, "id"> & {
  label: string;
  name: string;
  error?: string;
  min?: number;
  max?: number;
};

export function TextArea({
  label,
  required,
  error,
  min,
  max,
  value,
  defaultValue,
  onChange,
  rows = 5,
  ...props
}: TextAreaProps) {
  const { counter, handleChange } = useCharacterCounter({ value, defaultValue, onChange, min, max });

  return (
    <FormField label={label} required={required} error={error} counter={counter}>
      {(control) => (
        <textarea
          {...props}
          {...control}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`${fieldClasses} py-3`}
        />
      )}
    </FormField>
  );
}
