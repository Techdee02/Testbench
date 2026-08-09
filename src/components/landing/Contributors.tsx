import Image from "next/image";

type Contributor = {
  name: string;
  role: string;
  initials: string;
  paper: string;
  photo?: string;
  linkedin?: string;
  whatsapp?: string;
};

const contributors: Contributor[] = [
  {
    name: "Akeem Jr Odebiyi",
    role: "Project Lead · Full Stack & Infra",
    initials: "AO",
    paper: "bg-mint-200",
    photo: "/Akeem.jpg",
    linkedin: "https://www.linkedin.com/in/akeem-jr-odebiyi",
    whatsapp: "https://wa.me/2348059059440",
  },
  {
    name: "Eyitayo Obembe",
    role: "Backend & Pipeline",
    initials: "EO",
    paper: "bg-gold-300",
    photo: "/Eyitayo.PNG",
    linkedin: "https://www.linkedin.com/in/eyitayo-obembe",
    whatsapp: "https://wa.me/2348085716180",
  },
  {
    name: "Henry Fakorode",
    role: "Backend & API",
    initials: "HF",
    paper: "bg-mint-400",
    photo: "/Henry.jpg",
    linkedin: "https://www.linkedin.com/in/fakorode-henry",
    whatsapp: "https://wa.me/2348100597712",
  },
  {
    name: "Afolabi Olanrewaju",
    role: "Publicity Graphics Designer",
    initials: "AF",
    paper: "bg-gold-500/30",
    photo: "/Afolabi.jpg",
    linkedin: "https://www.linkedin.com/in/afolabi-olanrewaju-035a43338",
    whatsapp: "https://wa.me/2349076286446",
  },
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
    //
    // Three layers on purpose: .flip-card owns perspective only, .flip-tilt
    // owns the resting per-card rotate only, .flip-inner owns the animated
    // flip only. See globals.css for why each transform needs its own
    // element instead of sharing one.
    <div className="flip-card aspect-[3/4] w-full" tabIndex={0}>
      <div className={`flip-tilt ${tilt}`}>
        <div className="flip-inner">
          {/* front */}
          <div className="flip-front tape-corner relative flex h-full flex-col rounded-sm bg-paper-card p-3 shadow-lg ring-1 ring-black/10">
            <div
              className={`relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-[2px] ${contributor.paper}`}
            >
              {contributor.photo ? (
                <Image
                  src={contributor.photo}
                  alt={contributor.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span className="font-display text-4xl font-bold text-ink-900/70">
                  {contributor.initials}
                </span>
              )}
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-mint-400 px-3 py-1.5 text-xs font-bold text-forest-900"
                  >
                    LinkedIn
                  </a>
                )}
                {contributor.whatsapp && (
                  <a
                    href={contributor.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
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
    </div>
  );
}
