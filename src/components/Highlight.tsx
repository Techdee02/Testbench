import { ReactNode } from "react";

// A highlighter-pen mark, not a straight border-bottom. The path has
// slightly uneven edges and rounded ends, like a real marker stroke.
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="highlight-mark">
      {children}
      <svg viewBox="0 0 200 24" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M3 15 C 40 20, 90 8, 130 13 C 155 16, 175 10, 197 14 L 197 22 C 160 19, 120 24, 80 21 C 50 19, 20 23, 3 21 Z"
          fill="currentColor"
          opacity="0.55"
        />
      </svg>
    </span>
  );
}
