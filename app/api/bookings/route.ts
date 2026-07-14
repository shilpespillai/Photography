import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

// GET /api/bookings?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns only date/time/status for slots that are held or confirmed —
// never client names or emails — so the public calendar can grey them out.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = adminDb()
      .collection("bookings")
      .where("status", "in", ["pending_payment", "confirmed"]);

    if (from) query = query.where("date", ">=", from) as typeof query;
    if (to) query = query.where("date", "<=", to) as typeof query;

    const snap = await query.get();
    const slots = snap.docs.map((d) => ({
      date: d.data().date as string,
      time: d.data().time as string,
      status: d.data().status as string,
    }));

    return NextResponse.json({ slots });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not load booked slots." },
      { status: 500 }
    );
  }
}

// POST /api/bookings
// Creates a pending hold on a slot before the client is sent to Stripe.
// Rejects the request if the slot is already held or confirmed.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, time, sessionType, clientName, clientEmail } = body;

    if (!date || !time || !sessionType || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: "Missing required booking details." },
        { status: 400 }
      );
    }

    const db = adminDb();
    const existing = await db
      .collection("bookings")
      .where("date", "==", date)
      .where("time", "==", time)
      .where("status", "in", ["pending_payment", "confirmed"])
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: "That slot was just taken. Please pick another." },
        { status: 409 }
      );
    }

    const docRef = await db.collection("bookings").add({
      date,
      time,
      sessionType,
      clientName,
      clientEmail,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ bookingId: docRef.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not create booking." },
      { status: 500 }
    );
  }
}
