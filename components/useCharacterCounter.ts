"use client";

import { useState, type ChangeEvent } from "react";
import { formatMessage } from "@/lib/copy/messages";
import type { FieldCounter } from "./FormField";

type CounterOptions<T> = {
  value?: unknown;
  defaultValue?: unknown;
  onChange?: (event: ChangeEvent<T>) => void;
  min?: number;
  max?: number;
};

export function useCharacterCounter<T extends HTMLInputElement | HTMLTextAreaElement>({
  value,
  defaultValue,
  onChange,
  min,
  max,
}: CounterOptions<T>) {
  const [typed, setTyped] = useState(String(defaultValue ?? ""));
  const count = Array.from(String(value ?? typed)).length;

  const counter: FieldCounter | undefined =
    max === undefined
      ? undefined
      : {
          text: formatMessage("form.counter", { count, max }),
          outOfRange: count > max || (min !== undefined && count > 0 && count < min),
        };

  function handleChange(event: ChangeEvent<T>) {
    setTyped(event.target.value);
    onChange?.(event);
  }

  return { counter, handleChange };
}
