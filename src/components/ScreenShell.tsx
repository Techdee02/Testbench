import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { AuthStatus } from "@/components/AuthStatus";
import { MobileMenu } from "@/components/MobileMenu";

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
        <div className="flex items-center gap-4">
          <Link
            href="/discover"
            className="hidden text-sm font-semibold text-ink-600 hover:text-forest-700 sm:inline"
          >
            Discover
          </Link>
          <AuthStatus />
          <MobileMenu />
        </div>
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
