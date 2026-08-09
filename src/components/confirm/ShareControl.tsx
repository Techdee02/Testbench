"use client";

import { useState } from "react";
import { setVisibility } from "@/lib/api";
import { SetVisibility, SetVisibilityResponse } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const visibilityOptions: { value: SetVisibility; label: string; blurb: string }[] = [
  { value: "private", label: "Private", blurb: "Only you can see it" },
  { value: "shared", label: "Shared", blurb: "Anyone with the link" },
  { value: "public", label: "Public", blurb: "Listed on Discover" },
];

export function ShareControl({
  setId,
  canPublish,
  onBeforePublish,
}: {
  setId: string;
  // Client-side gate mirroring the backend's real rule ("can't publish a
  // set with no confirmed questions") — computed from the question list
  // the confirm screen already has, so Shared/Public never even look
  // clickable when there's nothing to share, rather than letting the
  // student hit the button and read a 400 back.
  canPublish: boolean;
  // Sharing implies confirming — a set sitting at all pending_review has
  // nothing confirmed yet, so selecting Shared/Public runs the same
  // confirm-pending step Start Practising does before calling the API.
  onBeforePublish: () => Promise<void>;
}) {
  // There's no GET for a set's current visibility (only the owner's
  // question list or a PATCH response return it) — this starts assuming
  // "private" until the student picks something, rather than pretending
  // to know a value we haven't actually fetched.
  const [visibility, setVisibilityState] = useState<SetVisibility>("private");
  const [result, setResult] = useState<SetVisibilityResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Local only — there's no request field or endpoint to set a title yet
  // (checked the live OpenAPI schema; every set comes back title: null).
  // Kept in local state so this has a natural home once that endpoint
  // exists — TODO: wire this to the backend when it does.
  const [title, setTitle] = useState("");

  async function handleSelect(next: SetVisibility) {
    if (next === visibility || busy) return;
    setError(null);

    if (next !== "private" && !canPublish) {
      setError("Confirm at least one question first — discard or undo below.");
      return;
    }

    setBusy(true);
    try {
      if (next !== "private") {
        await onBeforePublish();
      }
      const res = await setVisibility(setId, next);
      setVisibilityState(res.visibility);
      setResult(res);
    } catch {
      setError("Couldn't update sharing. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  const shareUrl =
    result?.visibility === "shared" && result.share_token
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/shared/${result.share_token}`
      : null;

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy — you can select and copy the link manually.");
    }
  }

  return (
    <div className="torn-top tilt-3 rounded-b-xl bg-paper-card p-6 shadow-md ring-1 ring-ink-900/10">
      <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-600">
        Share this set
      </p>

      <label htmlFor="set-title" className="mt-3 block text-xs font-semibold text-ink-600">
        Name it (optional — not saved yet, coming soon)
      </label>
      <input
        id="set-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. CSC 301 — Midterm PQs"
        className="mt-1 w-full rounded-lg border-2 border-ink-900/15 bg-paper px-3 py-2 text-sm outline-none focus:border-forest-700/40"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {visibilityOptions.map((opt) => {
          const disabled = busy || (opt.value !== "private" && !canPublish);
          const active = visibility === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(opt.value)}
              title={opt.blurb}
              className={`rounded-full border-2 px-4 py-2 text-sm font-display font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? "border-forest-900 bg-forest-900 text-mint-200"
                  : "border-ink-900/20 bg-paper-card text-ink-900 hover:border-ink-900/40"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {!canPublish && (
        <p className="mt-2 text-xs text-ink-600">
          Confirm at least one question to share or publish this set.
        </p>
      )}

      {error && <p className="mt-3 text-sm font-semibold text-danger">{error}</p>}

      {shareUrl && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border-2 border-forest-700/30 bg-mint-200/30 px-3 py-2">
          <input
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 bg-transparent text-sm text-forest-900 outline-none"
          />
          <Button variant="secondary" onClick={copyLink} className="shrink-0 px-3 py-1.5 text-xs">
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>
      )}

      {result?.visibility === "public" && (
        <p className="mt-4 text-sm font-semibold text-forest-700">
          This set is now visible on Discover.
        </p>
      )}
    </div>
  );
}
