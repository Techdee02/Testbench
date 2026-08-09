type Contributor = {
  name: string;
  role: string;
  initials: string;
  paper: string;
  linkedin?: string;
  whatsapp?: string;
};

// Placeholder roster — swap in the real build team's photos and links
// before launch. Names/roles reflect what's actually documented in the
// role PRDs (Akeem owns Frontend, "the Floater" is the PRDs' own name for
// whoever owns the FastAPI service); the rest are open invite slots.
const contributors: Contributor[] = [
  { name: "Akeem", role: "Frontend", initials: "AK", paper: "bg-mint-200" },
  { name: "The Floater", role: "Backend & API", initials: "FL", paper: "bg-gold-300" },
  { name: "—", role: "Infra (open)", initials: "IN", paper: "bg-paper-dim" },
  { name: "—", role: "Design (open)", initials: "DS", paper: "bg-paper-dim" },
];

export function Contributors() {
  return (
    <section className="bg-forest-900 bg-grain py-24 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Built by actual students.
        </h2>
        <p className="mt-3 max-w-xl text-mint-200/85">
          Hover or tap a card. This is the one thing on this page we spent
          real time on.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {contributors.map((c, i) => (
            <ContributorCard key={c.name + i} contributor={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContributorCard({
  contributor,
  index,
}: {
  contributor: Contributor;
  index: number;
}) {
  const tilt = ["tilt-1", "tilt-2", "tilt-3", "tilt-4"][index % 4];
  const hasLinks = contributor.linkedin || contributor.whatsapp;

  return (
    // Focusable regardless of hasLinks — :focus-within is also how the flip
    // triggers on tap (touch devices don't have :hover), so an open slot
    // needs to be reachable too, not just cards with real links.
    <div className="flip-card aspect-[3/4] w-full" tabIndex={0}>
      <div className={`flip-inner ${tilt}`}>
        {/* front */}
        <div className="flip-front tape-corner relative flex h-full flex-col rounded-sm bg-paper-card p-3 shadow-lg ring-1 ring-black/10">
          <div
            className={`flex min-h-0 flex-1 flex-col items-center justify-center rounded-[2px] ${contributor.paper}`}
          >
            <span className="font-display text-4xl font-bold text-ink-900/70">
              {contributor.initials}
            </span>
          </div>
          <div className="shrink-0 pt-2 text-center">
            <p className="font-display text-sm font-bold text-ink-900">
              {contributor.name}
            </p>
            <p className="text-xs text-ink-600">{contributor.role}</p>
          </div>
        </div>

        {/* back */}
        <div className="flip-back bg-grain flex flex-col items-center justify-center gap-3 rounded-sm bg-forest-700 p-4 text-center shadow-lg ring-1 ring-black/10">
          <p className="font-display text-sm font-bold text-mint-200">
            {contributor.name}
          </p>
          {hasLinks ? (
            <div className="flex gap-3">
              {contributor.linkedin && (
                <a
                  href={contributor.linkedin}
                  className="rounded-full bg-mint-400 px-3 py-1.5 text-xs font-bold text-forest-900"
                >
                  LinkedIn
                </a>
              )}
              {contributor.whatsapp && (
                <a
                  href={contributor.whatsapp}
                  className="rounded-full bg-gold-500 px-3 py-1.5 text-xs font-bold text-forest-900"
                >
                  WhatsApp
                </a>
              )}
            </div>
          ) : (
            <p className="text-xs text-mint-200/70">This slot&apos;s open</p>
          )}
        </div>
      </div>
    </div>
  );
}
