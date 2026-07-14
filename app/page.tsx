import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SESSION_TYPES } from "@/lib/sessions";

const PORTFOLIO_FRAMES = [
  { n: "01", cat: "Maternity", tone: "from-blush/40 to-ink" },
  { n: "02", cat: "Birthday", tone: "from-gold/40 to-ink" },
  { n: "03", cat: "Event", tone: "from-sage/30 to-ink" },
  { n: "04", cat: "Maternity", tone: "from-gold/30 to-ink" },
  { n: "05", cat: "Birthday", tone: "from-blush/30 to-ink" },
  { n: "06", cat: "Event", tone: "from-sage/40 to-ink" },
  { n: "07", cat: "Birthday", tone: "from-blush/25 to-ink" },
  { n: "08", cat: "Maternity", tone: "from-gold/25 to-ink" },
  { n: "09", cat: "Event", tone: "from-sage/25 to-ink" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-8 md:px-12 md:pb-32">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="frame-label mb-6 text-gold">
              Roll 01 — Now booking
            </p>
            <h1 className="font-display text-5xl leading-[1.05] text-paper md:text-7xl">
              Real moments,
              <br />
              held onto <span className="italic text-blush">gently.</span>
            </h1>
            <p className="mt-6 max-w-md font-body text-paper/70">
              Photography for the days that mark a life moving forward —
              first birthdays, growing bellies, and the parties in between.
              Based on-location, available for travel.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="rounded-full bg-gold px-7 py-3 font-body text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
              >
                Check availability
              </Link>
              <a
                href="#portfolio"
                className="font-body text-sm text-paper/70 underline decoration-gold/40 underline-offset-4 hover:text-paper"
              >
                See the portfolio
              </a>
            </div>
          </div>

          {/* Scattered print stack — signature element */}
          <div className="relative mx-auto h-72 w-full max-w-sm md:h-96">
            <div className="absolute left-4 top-6 w-48 rotate-[-8deg] rounded-sm bg-paper p-2 shadow-2xl md:w-56">
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-blush/50 to-ink/80" />
              <p className="frame-label mt-2 text-ink/60">Frame 04 · Maternity</p>
            </div>
            <div className="absolute right-2 top-0 w-44 rotate-[6deg] rounded-sm bg-paper p-2 shadow-2xl md:w-52">
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-gold/50 to-ink/80" />
              <p className="frame-label mt-2 text-ink/60">Frame 07 · Birthday</p>
            </div>
            <div className="absolute bottom-0 left-16 w-44 rotate-[3deg] rounded-sm bg-paper p-2 shadow-2xl md:w-52">
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-sage/50 to-ink/80" />
              <p className="frame-label mt-2 text-ink/60">Frame 09 · Event</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio — contact sheet */}
      <section id="portfolio" className="border-t border-[var(--line)] px-6 py-20 md:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="frame-label text-gold">Contact sheet</p>
            <h2 className="mt-2 font-display text-3xl text-paper md:text-4xl">
              Recent rolls
            </h2>
          </div>
          <p className="hidden font-body text-sm text-paper/50 md:block">
            Replace these frames with your own images in /public
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 md:gap-4">
          {PORTFOLIO_FRAMES.map((f) => (
            <div key={f.n} className="group relative overflow-hidden rounded-sm">
              <div
                className={`aspect-square w-full bg-gradient-to-br ${f.tone} transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 px-3 py-2 backdrop-blur-sm">
                <span className="frame-label text-paper/70">Frame {f.n}</span>
                <span className="frame-label text-gold">{f.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-[var(--line)] px-6 py-20 md:px-12">
        <p className="frame-label text-gold">Sessions</p>
        <h2 className="mt-2 font-display text-3xl text-paper md:text-4xl">
          What to book
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SESSION_TYPES.map((s) => (
            <div
              key={s.id}
              className="flex flex-col justify-between rounded-lg border border-[var(--line)] p-6"
            >
              <div>
                <h3 className="font-display text-xl text-paper">{s.name}</h3>
                <p className="frame-label mt-1 text-paper/50">{s.duration}</p>
                <p className="mt-4 font-body text-sm text-paper/70">
                  {s.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-2xl text-gold">
                  ${s.price}
                </span>
                <Link
                  href="/book"
                  className="frame-label text-paper/70 underline decoration-gold/40 underline-offset-4 hover:text-paper"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
