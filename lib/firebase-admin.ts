import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Server-only. Requires FIREBASE_SERVICE_ACCOUNT_KEY (a JSON string of your
// service account key) set as an environment variable in Vercel. Generate it
// from Firebase Console > Project Settings > Service Accounts > Generate new
// private key. Never expose this value client-side or commit it to git.
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set. Add it in your Vercel project's environment variables."
    );
  }
  const serviceAccount = JSON.parse(raw);
  return initializeApp({ credential: cert(serviceAccount) });
}

export function adminDb() {
  return getFirestore(getAdminApp());
}
