"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenShell } from "@/components/ScreenShell";
import { Button } from "@/components/ui/Button";
import { presignUpload, putFile, startUpload } from "@/lib/api";
import { getToken } from "@/lib/session";
import { PracticeMode, QuestionFormat } from "@/lib/types";

const formats: { value: QuestionFormat; label: string; blurb: string }[] = [
  { value: "mixed", label: "Mixed", blurb: "MCQ and theory — the strongest retrieval effect" },
  { value: "mcq", label: "MCQ only", blurb: "Quick to run through" },
  { value: "theory", label: "Theory only", blurb: "Free recall, no options to lean on" },
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<PracticeMode>("untimed");
  const [format, setFormat] = useState<QuestionFormat>("mixed");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/auth?next=/upload");
  }, [router]);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
    setError(null);
  }

  async function handleSubmit() {
    if (!file) {
      setError("Pick a file first — PDF, image, or photo.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { upload_url, upload_id } = await presignUpload(file.name, file.type);
      await putFile(upload_url, file);
      await startUpload(upload_id, mode, format);
      router.push(`/processing/${upload_id}`);
    } catch {
      setError("Something went wrong sending that file. Try again?");
      setBusy(false);
    }
  }

  return (
    <ScreenShell>
      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
        Step 1 of 3
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Give us the messy version.
      </h1>
      <p className="mt-2 max-w-lg text-ink-600">
        A skewed photo is fine. A scanned bundle is fine. We&apos;ll clean it up
        from here.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <label
            htmlFor="file"
            className="torn-top tilt-1 block cursor-pointer rounded-b-xl border-2 border-dashed border-ink-900/25 bg-paper-card px-6 py-10 text-center transition-colors hover:border-forest-700"
          >
            <input
              id="file"
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={handleFile}
            />
            <p className="font-display font-semibold">
              {file ? file.name : "Tap to choose a PDF, image, or photo"}
            </p>
            {file && (
              <p className="mt-1 text-xs text-ink-600">
                {(file.size / 1024).toFixed(0)} KB — ready to go
              </p>
            )}
          </label>
        </div>

        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-600">
            Question format
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {formats.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${
                  format === f.value
                    ? "border-forest-900 bg-mint-200/60"
                    : "border-ink-900/15 bg-paper-card hover:border-ink-900/30"
                }`}
              >
                <p className="font-display font-bold">{f.label}</p>
                <p className="mt-1 text-xs text-ink-600">{f.blurb}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-600">
            Practice mode
          </p>
          <div className="flex gap-3">
            {(["untimed", "timed"] as PracticeMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full border-2 px-5 py-2 font-display font-semibold capitalize transition-colors ${
                  mode === m
                    ? "border-forest-900 bg-forest-900 text-mint-200"
                    : "border-ink-900/20 bg-paper-card text-ink-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-danger">{error}</p>}

        <Button onClick={handleSubmit} disabled={busy} className="w-full sm:w-auto">
          {busy ? "Sending…" : "Upload and structure it"}
        </Button>
      </div>
    </ScreenShell>
  );
}
