import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase-admin";

// POST /api/webhook
// Stripe calls this when a checkout session completes. It marks the booking
// "confirmed" so the slot stays permanently blocked, independent of whether
// the client's browser makes it back to the success page.
// Requires STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET (from the Stripe
// Dashboard once you add this endpoint's URL under Developers > Webhooks).
export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }
  const stripe = new Stripe(secretKey);

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await adminDb().collection("bookings").doc(bookingId).update({
        status: "confirmed",
        stripeSessionId: session.id,
      });
    }
  }

  return NextResponse.json({ received: true });
}
