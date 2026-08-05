"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { getUploadStatus } from "@/lib/api";

const messages = [
  "Reading the pages…",
  "Scoring OCR confidence, block by block…",
  "Structuring questions…",
  "Almost there…",
];

export default function ProcessingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;

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
      } catch {
        // keep polling — a transient failure here shouldn't strand the student
      }
      if (!cancelled) setTimeout(poll, 2000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  return (
    <ScreenShell narrow>
      <div className="torn-top tilt-2 rounded-b-xl bg-paper-card p-10 text-center shadow-lg ring-1 ring-ink-900/10">
        {failed ? (
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
          </>
        )}
      </div>
    </ScreenShell>
  );
}
