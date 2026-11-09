import type { ReactNode } from "react";

type AlertType = "error" | "success" | "warning" | "info";

const typeClasses: Record<AlertType, string> = {
  error: "border-error text-error",
  success: "border-success text-success",
  warning: "border-warning text-warning",
  info: "border-border text-text",
};

export function Alert({ type, children }: { type: AlertType; children: ReactNode }) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`rounded-md border bg-background p-4 text-sm ${typeClasses[type]}`}
    >
      {children}
    </div>
  );
}
