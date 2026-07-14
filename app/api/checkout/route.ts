import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";
import { SESSION_TYPES } from "@/lib/sessions";

// POST /api/checkout
// Takes a bookingId created by /api/bookings and starts a Stripe Checkout
// session for the matching session type's price. Requires STRIPE_SECRET_KEY.
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Add STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }
  const stripe = new Stripe(secretKey);

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId." }, { status: 400 });
    }

    const db = adminDb();
    const bookingSnap = await db.collection("bookings").doc(bookingId).get();
    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }
    const booking = bookingSnap.data()!;
    const sessionType = SESSION_TYPES.find((s) => s.id === booking.sessionType);
    if (!sessionType) {
      return NextResponse.json({ error: "Unknown session type." }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: booking.clientEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: sessionType.price * 100,
            product_data: {
              name: `${sessionType.name} — ${booking.date} ${booking.time}`,
              description: sessionType.description,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId },
      success_url: `${origin}/book/confirmed?bookingId=${bookingId}`,
      cancel_url: `${origin}/book?cancelled=1`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
