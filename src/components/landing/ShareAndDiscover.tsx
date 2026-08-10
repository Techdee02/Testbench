import { LinkButton } from "@/components/ui/Button";

const features = [
  {
    icon: <LinkIcon />,
    title: "Share a link",
    body: "Send your confirmed set straight to your study group. They practise it immediately — no account, no edit access, just the questions.",
    tilt: "tilt-2",
  },
  {
    icon: <GlobeIcon />,
    title: "Publish it",
    body: "Make it fully public and it shows up on Discover — open to anyone, not just whoever you sent a link to.",
    tilt: "tilt-1",
  },
  {
    icon: <CompassIcon />,
    title: "Or take someone else's",
    body: "Browse sets other students already built and confirmed. Sometimes the fastest way to practise is skipping the upload entirely.",
    tilt: "tilt-4",
  },
];

export function ShareAndDiscover() {
  return (
    <section className="bg-paper-dim py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Your set doesn&apos;t have to end with you.
        </h2>
        <p className="mt-3 max-w-2xl text-ink-600">
          A confirmed set isn&apos;t stuck on your account. Share the link,
          publish it properly, or skip the upload and take one someone else
          already made.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`torn-top ${f.tilt} rounded-b-xl bg-paper-card p-7 shadow-md ring-1 ring-ink-900/10 transition-transform hover:rotate-0`}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-mint-200 text-forest-900">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-bold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {f.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <LinkButton href="/discover" variant="secondary">
            Browse Discover
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M9.5 14.5l5-5M10 8.5l1-1a3 3 0 114.24 4.24l-1 1M14 15.5l-1 1a3 3 0 11-4.24-4.24l1-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 12h16M12 4c2.2 2.2 3.3 5 3.3 8s-1.1 5.8-3.3 8c-2.2-2.2-3.3-5-3.3-8S9.8 6.2 12 4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14.8 9.2l-1.6 4.4-4.4 1.6 1.6-4.4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
