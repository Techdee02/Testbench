import { Logo } from "@/components/Logo";

// Ordered by priority, not alphabetically: LinkedIn is SEES Tech Hub's
// biggest page, WhatsApp is the biggest community and where the group
// actually lives day to day.
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sees-tech-hub/" },
  { label: "WhatsApp community", href: "https://chat.whatsapp.com/JAIc2yFhyqAL30lD3bBXis?s=cl&p=a&mlu=4" },
  { label: "X", href: "https://x.com/SEESTechHub" },
  { label: "Instagram", href: "https://www.instagram.com/sees_techhub?igsh=MTBobjdsNXp3OTdoYQ==" },
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
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-700"
            >
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
