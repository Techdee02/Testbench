"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { ApiError, getUploadStatus } from "@/lib/api";

const messages = [
  "Reading the pages…",
  "Scoring OCR confidence, block by block…",
  "Structuring questions…",
  "Almost there…",
];

const POLL_INTERVAL_MS = 2000;
// PRD's stated expectation is "under two minutes" — give it a comfortable
// margin past that before telling the student something looks stuck, rather
// than making them guess by watching a spinner indefinitely.
const LONG_WAIT_AFTER_MS = 90_000;

export default function ProcessingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [longWait, setLongWait] = useState(false);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    async function poll() {
      try {
        const upload = await getUploadStatus(id);
        if (cancelled) return;
        if (upload.status === "ready") {
          router.push(`/confirm/${id}`);
          return;
        }
        if (upload.status === "failed") {
          setFailed(true);
          return;
        }
      } catch (err) {
        // A 404 means this upload id doesn't exist — that's terminal, no
        // amount of retrying fixes it. Anything else (network blip, a
        // transient 5xx) is worth another try.
        if (err instanceof ApiError && err.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
      }
      if (!cancelled) {
        if (Date.now() - startedAt > LONG_WAIT_AFTER_MS) setLongWait(true);
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  return (
    <ScreenShell narrow>
      <div className="torn-top tilt-2 rounded-b-xl bg-paper-card p-10 text-center shadow-lg ring-1 ring-ink-900/10">
        {notFound ? (
          <>
            <p className="font-display text-2xl font-bold text-danger">
              We can&apos;t find that upload.
            </p>
            <p className="mt-3 text-ink-600">
              It may have expired, or the link&apos;s off. Try uploading again.
            </p>
            <Link href="/upload" className="mt-6 inline-block">
              <Button>Back to upload</Button>
            </Link>
          </>
        ) : failed ? (
          <>
            <p className="font-display text-2xl font-bold text-danger">
              That one didn&apos;t come through cleanly.
            </p>
            <p className="mt-3 text-ink-600">
              You can paste the text directly instead of re-uploading.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-forest-900/15 border-t-forest-900" />
            <p className="font-display text-xl font-bold">
              {messages[messageIndex]}
            </p>
            <p className="mt-3 text-sm text-ink-600">
              Usually under two minutes. Don&apos;t close this tab.
            </p>
            {longWait && (
              <div className="mt-6 rounded-lg border-2 border-gold-500/60 bg-gold-500/10 p-4 text-sm">
                <p className="font-semibold text-[#8a5a00]">
                  This is taking longer than usual.
                </p>
                <p className="mt-1 text-ink-600">
                  We&apos;ll keep trying — feel free to come back to this page
                  later, or start over if you&apos;d rather not wait.
                </p>
                <Link href="/upload" className="mt-3 inline-block">
                  <Button variant="secondary">Back to upload</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </ScreenShell>
  );
}
