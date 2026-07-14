import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ConfirmedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Nav />
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="frame-label text-gold">Frame secured</p>
        <h1 className="mt-3 font-display text-4xl text-paper md:text-5xl">
          You&apos;re booked
        </h1>
        <p className="mt-4 max-w-md font-body text-paper/70">
          Your session is confirmed and your slot is held. A confirmation
          email is on its way — reach out any time if your plans change.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gold px-7 py-3 font-body text-sm font-medium text-ink"
        >
          Back to home
        </Link>
      </section>
      <Footer />
    </div>
  );
}
