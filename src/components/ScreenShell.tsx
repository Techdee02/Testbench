import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { AuthStatus } from "@/components/AuthStatus";

export function ScreenShell({
  children,
  narrow = false,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b-2 border-ink-900/10 px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo tone="ink" className="h-7 w-7" />
          <span className="font-display text-lg font-bold">Testbench</span>
        </Link>
        <AuthStatus />
      </header>
      <main
        className={`mx-auto w-full flex-1 px-6 py-12 ${
          narrow ? "max-w-lg" : "max-w-3xl"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
