import { LinkButton } from "@/components/ui/Button";
import { Highlight } from "@/components/Highlight";

export function Hero() {
  return (
    <section className="bg-grain relative overflow-hidden bg-forest-900 text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div className="relative z-10">
          <p className="mb-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-mint-400">
            SEES Tech Hub &middot; built for exam week
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            That PQ pile on your phone isn&apos;t studying.
            <br />
            We turn it into a{" "}
            <Highlight>
              <span className="text-mint-200">real practice set</span>
            </Highlight>
            .
          </h1>
          <p className="mt-6 max-w-xl text-lg text-mint-200/90">
            Upload the scans, photos, and PDFs you already have. Testbench
            extracts and structures them into clean questions, you confirm
            what it got right, then you practise for real &mdash; timed or not.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href="/upload" className="bg-mint-400 text-forest-900 shadow-[3px_3px_0_0_var(--color-gold-500)] hover:shadow-[1px_1px_0_0_var(--color-gold-500)] hover:translate-x-[2px] hover:translate-y-[2px]">
              Upload your first PQ
            </LinkButton>
            <a
              href="#how-it-works"
              className="font-display font-semibold text-mint-200 underline decoration-mint-400 decoration-2 underline-offset-4 hover:text-mint-400"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative hidden items-center justify-center md:flex" aria-hidden="true">
          <MessyToClean />
        </div>
      </div>
    </section>
  );
}

function MessyToClean() {
  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-sm text-mint-400">
      {/* messy stack */}
      <g stroke="currentColor" strokeWidth="2" fill="none" opacity="0.55">
        <rect x="24" y="60" width="120" height="150" rx="4" transform="rotate(-9 84 135)" />
        <rect x="40" y="50" width="120" height="150" rx="4" transform="rotate(6 100 125)" />
        <rect x="18" y="70" width="120" height="150" rx="4" transform="rotate(-2 78 145)" />
        <path d="M45 95 l60 -8 M50 115 l55 4 M48 135 l58 -6" transform="rotate(-2 78 145)" />
      </g>
      {/* arrow */}
      <path
        d="M168 150 h48"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
        </marker>
      </defs>
      {/* clean stack */}
      <g>
        <rect x="232" y="70" width="110" height="150" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5" transform="translate(-40 0)" />
        <g transform="translate(-40 0)" stroke="currentColor" strokeWidth="2">
          <line x1="248" y1="100" x2="326" y2="100" />
          <line x1="248" y1="118" x2="326" y2="118" />
          <line x1="248" y1="136" x2="300" y2="136" />
          <circle cx="256" cy="160" r="5" />
          <line x1="270" y1="160" x2="320" y2="160" />
          <circle cx="256" cy="180" r="5" />
          <line x1="270" y1="180" x2="310" y2="180" />
        </g>
      </g>
    </svg>
  );
}
