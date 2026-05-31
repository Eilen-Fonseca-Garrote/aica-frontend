import React from "react";

export type ButtonVariant = "ghost" | "primary" | "danger" | "default";
export type ButtonSize = "icon" | "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({ variant = "default", size = "md", className = "", children, ...props }: ButtonProps) => {
  const base = "rounded transition inline-flex items-center justify-center";

  const variantClass =
    variant === "ghost"
      ? "bg-transparent text-white hover:bg-[var(--app-sidebar-hover)]"
      : variant === "primary"
      ? "bg-[var(--app-primary-color)] text-white hover:bg-[var(--app-primary-hover)]"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-[var(--app-primary-color)] text-white hover:bg-[var(--app-primary-hover)]";

  const sizeClass =
    size === "icon"
      ? "p-2"
      : size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2";

  return (
    <button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

