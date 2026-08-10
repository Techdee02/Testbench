import { Logo } from "@/components/Logo";

// Letterhead for printed sheets — logo + product name + a real contact
// email, so a printed set reads as something an org actually put out, not
// a bare list of questions. Dark logo tone on purpose: the mint/white mark
// used in the app header would disappear on white paper.
export function PrintHeader() {
  return (
    <div className="mb-6 flex items-center justify-between border-b-2 border-ink-900/20 pb-4">
      <div className="flex items-center gap-2">
        <Logo tone="ink" className="h-8 w-8" />
        <span className="font-display text-xl font-bold">Testbench</span>
      </div>
      <span className="text-sm text-ink-600">seestechhub@gmail.com</span>
    </div>
  );
}
