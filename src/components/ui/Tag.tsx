import { ReactNode } from "react";

type Tone = "gold" | "mint" | "ink" | "danger";

const toneClasses: Record<Tone, string> = {
  gold: "bg-gold-500/20 text-[#8a5a00] border-gold-500",
  mint: "bg-mint-400/25 text-forest-900 border-forest-700",
  ink: "bg-ink-900/5 text-ink-900 border-ink-900/30",
  danger: "bg-danger/10 text-danger border-danger",
};

export function Tag({
  children,
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
