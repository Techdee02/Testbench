"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { ApiError, getDiscoverSets } from "@/lib/api";
import { DiscoverSetItem } from "@/lib/types";

const PAGE_SIZE = 20;

export default function DiscoverPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DiscoverSetItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Resetting for a new page fetch, not one-time hydration — still a
    // legitimate sync setState-in-effect, just a different reason than the
    // usual localStorage-read case elsewhere in this codebase.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    getDiscoverSets(page, PAGE_SIZE)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? `Couldn't load Discover (${err.status}). Try again in a moment.`
            : "Couldn't load Discover. Try again in a moment."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <ScreenShell>
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
        Discover
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Sets other students made public.
      </h1>
      <p className="mt-2 max-w-lg text-ink-600">
        Browsing is open to everyone, no account needed. Tap a set to look
        it over or jump straight into practice.
      </p>

      {loading && (
        <div className="mt-8 flex items-center gap-3 text-ink-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
          Loading…
        </div>
      )}

      {error && <p className="mt-8 text-sm font-semibold text-danger">{error}</p>}

      {!loading && !error && items && items.length === 0 && (
        <p className="mt-8 text-ink-600">
          Nothing&apos;s been published yet. Be the first — publish a set from
          the confirm screen.
        </p>
      )}

      {!loading && !error && items && items.length > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((item, i) => {
              const tilt = ["tilt-1", "tilt-2", "tilt-3", "tilt-4"][i % 4];
              return (
                <Link
                  key={item.id}
                  href={`/discover/${item.id}`}
                  className={`torn-top ${tilt} block rounded-b-xl bg-paper-card p-5 shadow-md ring-1 ring-ink-900/10 transition-transform hover:-translate-y-0.5`}
                >
                  <p className="font-display text-lg font-bold">
                    {item.title ?? "Untitled set"}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">
                    {item.question_count} question
                    {item.question_count === 1 ? "" : "s"}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <p className="text-sm text-ink-600">
              Page {page} of {totalPages}
            </p>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </ScreenShell>
  );
}
