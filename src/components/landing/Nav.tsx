import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/ui/Button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b-2 border-ink-900/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo tone="ink" className="h-8 w-8" />
          <span className="font-display text-xl font-bold tracking-tight">
            Testbench
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/auth"
            className="hidden sm:inline text-sm font-semibold text-ink-900 hover:text-forest-700"
          >
            Log in
          </Link>
          <LinkButton href="/upload" className="px-5 py-2.5 text-sm">
            Get started
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
