import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-xl border border-line bg-ink-raised/70 px-4 py-3.5 text-[0.95rem] text-bone placeholder:text-silver-dim transition-colors duration-300 hover:border-line-strong focus:border-cobalt-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-soft/50";

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Shell({
  id,
  label,
  error,
  hint,
  required,
  children,
}: BaseProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-bone-soft">
          {label}
          {required ? (
            <span aria-hidden="true" className="ms-1 text-cobalt-soft">
              *
            </span>
          ) : null}
        </span>
        {hint ? <span className="font-mono text-[0.65rem] text-silver-dim">{hint}</span> : null}
      </label>
      {children}
      <p
        id={`${id}-error`}
        role="alert"
        className={cn(
          "min-h-[1.1rem] text-xs text-alert transition-opacity duration-200",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error ?? ""}
      </p>
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  required,
  className,
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const id = rest.id ?? generatedId;

  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <input
        {...rest}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(CONTROL, error && "border-alert/70", className)}
      />
    </Shell>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  required,
  className,
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const id = rest.id ?? generatedId;

  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        {...rest}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(CONTROL, "min-h-36 resize-y", error && "border-alert/70", className)}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  required,
  className,
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = useId();
  const id = rest.id ?? generatedId;

  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <select
          {...rest}
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(CONTROL, "appearance-none pe-11", error && "border-alert/70", className)}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="pointer-events-none absolute end-4 top-1/2 h-2 w-3 -translate-y-1/2 text-silver"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1.5 6 6.5 11 1.5" />
        </svg>
      </div>
    </Shell>
  );
}
