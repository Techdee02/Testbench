const steps = [
  {
    label: "01 · Upload",
    title: "Drop in what you already have",
    body: "A skewed phone photo of a photocopied bundle, a lecture PDF, a scan from three years ago. It doesn't need to be clean.",
    tilt: "tilt-1",
  },
  {
    label: "02 · Confirm",
    title: "Check it before you trust it",
    body: "Testbench extracts and structures every question. You review each one, edit anything wrong, and flag what to skip. Low-confidence items are marked for you.",
    tilt: "tilt-4",
  },
  {
    label: "03 · Practise",
    title: "Test yourself, not your notes",
    body: "Timed or untimed, MCQ or theory. Immediate feedback after each question — no re-reading required.",
    tilt: "tilt-3",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        It&apos;s a real sequence, not a pitch diagram.
      </h2>
      <p className="mt-3 max-w-2xl text-ink-600">
        Every upload goes through the same three steps. Nothing gets skipped,
        especially not the middle one.
      </p>

      <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
        {steps.map((step, i) => (
          <div key={step.label} className="relative">
            <div
              className={`torn-top ${step.tilt} rounded-b-xl bg-paper-card p-7 shadow-md ring-1 ring-ink-900/10 transition-transform hover:rotate-0`}
            >
              <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
                {step.label}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {step.body}
              </p>
            </div>
            {i < steps.length - 1 && (
              <svg
                className="pointer-events-none absolute -right-5 top-1/2 hidden h-8 w-10 -translate-y-1/2 text-forest-700/50 md:block"
                viewBox="0 0 40 20"
                aria-hidden="true"
              >
                <path
                  d="M0 10 Q 12 2, 20 10 T 38 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
