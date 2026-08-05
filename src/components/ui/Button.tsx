import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-forest-900 text-mint-200 hover:bg-forest-700 shadow-[3px_3px_0_0_var(--color-gold-500)] hover:shadow-[1px_1px_0_0_var(--color-gold-500)] hover:translate-x-[2px] hover:translate-y-[2px]",
  secondary:
    "bg-paper-card text-ink-900 border-2 border-ink-900 hover:bg-mint-200",
  ghost: "bg-transparent text-forest-900 hover:bg-forest-900/5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-semibold tracking-tight transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
