"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { SESSION_TYPES, TIME_SLOTS, SessionTypeId } from "@/lib/sessions";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type SlotStatus = { date: string; time: string; status: string };

const DAYS_AHEAD = 21;

export default function BookingClient() {
  const days = useMemo(
    () =>
      Array.from({ length: DAYS_AHEAD }, (_, i) =>
        format(addDays(new Date(), i + 1), "yyyy-MM-dd")
      ),
    []
  );

  const [sessionType, setSessionType] = useState<SessionTypeId>("birthday");
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [bookedSlots, setBookedSlots] = useState<SlotStatus[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSlots() {
      setError(null);
      try {
        const res = await fetch(
          `/api/bookings?from=${days[0]}&to=${days[days.length - 1]}`
        );
        const data = await res.json();
        if (res.ok) {
          setBookedSlots(data.slots ?? []);
        } else {
          setError(data.error ?? "Could not load availability.");
        }
      } catch {
        setError(
          "Could not reach the booking backend. Make sure Firebase is configured."
        );
      }
    }
    loadSlots();
  }, [days]);

  const takenTimesForSelectedDate = bookedSlots
    .filter((s) => s.date === selectedDate)
    .map((s) => s.time);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime || !name || !email) return;
    setLoading(true);
    setError(null);
    try {
      const holdRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          sessionType,
          clientName: name,
          clientEmail: email,
        }),
      });
      const holdData = await holdRes.json();
      if (!holdRes.ok) {
        setError(holdData.error ?? "Could not hold that slot.");
        setLoading(false);
        return;
      }

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: holdData.bookingId }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        setError(checkoutData.error ?? "Could not start payment.");
        setLoading(false);
        return;
      }
      window.location.href = checkoutData.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <section className="px-6 py-14 md:px-12">
        <p className="frame-label text-gold">Book a session</p>
        <h1 className="mt-2 font-display text-4xl text-paper md:text-5xl">
          Check the roll, pick a frame
        </h1>
        <p className="mt-3 max-w-lg font-body text-sm text-paper/60">
          Grey slots are already booked. Choose a session type, an open time,
          and you&apos;ll be sent to a secure Stripe checkout to confirm with
          a deposit.
        </p>

        {error && (
          <div className="mt-6 rounded-md border border-blush/40 bg-blush/10 px-4 py-3 font-body text-sm text-blush">
            {error}
          </div>
        )}

        {/* Session type */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {SESSION_TYPES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSessionType(s.id)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                sessionType === s.id
                  ? "border-gold bg-gold/10"
                  : "border-[var(--line)] hover:border-paper/30"
              }`}
            >
              <p className="font-display text-lg text-paper">{s.name}</p>
              <p className="frame-label mt-1 text-paper/50">
                {s.duration} · ${s.price}
              </p>
            </button>
          ))}
        </div>

        {/* Date rail */}
        <div className="mt-10">
          <p className="frame-label mb-3 text-paper/60">Date</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedTime(null);
                }}
                className={`flex min-w-[68px] flex-col items-center rounded-md border px-3 py-2 transition-colors ${
                  selectedDate === d
                    ? "border-gold bg-gold/10 text-paper"
                    : "border-[var(--line)] text-paper/60 hover:border-paper/30"
                }`}
              >
                <span className="frame-label">{format(new Date(d), "EEE")}</span>
                <span className="font-display text-lg">
                  {format(new Date(d), "d")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div className="mt-8">
          <p className="frame-label mb-3 text-paper/60">
            Time — {format(new Date(selectedDate), "EEEE, MMM d")}
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {TIME_SLOTS.map((t) => {
              const taken = takenTimesForSelectedDate.includes(t);
              return (
                <button
                  key={t}
                  disabled={taken}
                  onClick={() => setSelectedTime(t)}
                  className={`rounded-md border px-3 py-3 font-body text-sm transition-colors ${
                    taken
                      ? "cursor-not-allowed border-[var(--line)] text-paper/25 line-through"
                      : selectedTime === t
                        ? "border-gold bg-gold text-ink"
                        : "border-[var(--line)] text-paper/80 hover:border-gold/60"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Client details + submit */}
        <form onSubmit={handleSubmit} className="mt-10 max-w-md space-y-4">
          <div>
            <label className="frame-label mb-2 block text-paper/60">
              Your name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[var(--line)] bg-transparent px-4 py-3 font-body text-paper placeholder:text-paper/30"
              placeholder="Jordan Lee"
            />
          </div>
          <div>
            <label className="frame-label mb-2 block text-paper/60">
              Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--line)] bg-transparent px-4 py-3 font-body text-paper placeholder:text-paper/30"
              placeholder="jordan@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={!selectedTime || loading}
            className="w-full rounded-full bg-gold px-6 py-3 font-body text-sm font-medium text-ink transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Redirecting to payment…" : "Continue to payment"}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}
