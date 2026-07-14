import Link from "next/link";

export default function Nav() {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12">
      <Link
        href="/"
        className="font-display text-lg tracking-wide text-paper"
      >
        Marigold &amp; Frame
      </Link>
      <nav className="flex items-center gap-6 font-body text-sm text-paper/80">
        <Link href="/#portfolio" className="hover:text-gold transition-colors">
          Portfolio
        </Link>
        <Link href="/#services" className="hover:text-gold transition-colors">
          Services
        </Link>
        <Link
          href="/book"
          className="rounded-full border border-gold/70 px-4 py-2 text-paper transition-colors hover:bg-gold hover:text-ink"
        >
          Book a session
        </Link>
      </nav>
    </header>
  );
}
