import { Logo } from "@/components/Logo";

// Social hrefs are placeholders — point these at SEES Tech Hub's real
// handles before launch.
const socials = [
  { label: "Instagram", href: "#" },
  { label: "X", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "WhatsApp community", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-ink-900/10 bg-paper-dim">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Logo tone="ink" className="h-6 w-6" />
          <span className="font-display text-sm font-bold">
            SEES Tech Hub
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-600">
          {socials.map((s) => (
            <a key={s.label} href={s.href} className="hover:text-forest-700">
              {s.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-ink-600">
          Testbench &middot; a SEES Tech Hub community project &middot;
          University of Lagos
        </p>
      </div>
    </footer>
  );
}
