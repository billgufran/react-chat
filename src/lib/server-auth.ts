import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";

export async function verifyAuthSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded; // has uid, email, etc.
  } catch {
    return null;
  }
}
