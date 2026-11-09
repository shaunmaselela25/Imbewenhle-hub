import type { ComponentProps } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-text hover:bg-primary-hover hover:text-background",
  secondary: "border border-border bg-background text-text hover:bg-surface",
  danger: "bg-error text-background hover:bg-text",
};

export function buttonClasses(variant: ButtonVariant = "primary") {
  return `inline-flex min-h-button min-w-touch items-center justify-center gap-2 rounded-md px-6 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]}`;
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant)}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
