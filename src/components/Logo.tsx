export function Logo({ className = "", tone = "mint" }: { className?: string; tone?: "mint" | "ink" }) {
  const color = tone === "mint" ? "var(--color-mint-400)" : "var(--color-ink-900)";
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="6" fill={color} />
      <path
        d="M24 14V6M24 34v8M14 24H6M34 24h8M17 17l-5.5-5.5M31 31l5.5 5.5M17 31l-5.5 5.5M31 17l5.5-5.5"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
