import type { ComponentProps } from "react";
import { fieldClasses, FormField } from "./FormField";

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
};

export function Select({ label, options, placeholder, required, error, ...props }: SelectProps) {
  return (
    <FormField label={label} required={required} error={error}>
      {(control) => (
        <select {...props} {...control} className={`${fieldClasses} min-h-button`}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
