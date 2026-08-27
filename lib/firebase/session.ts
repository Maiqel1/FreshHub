import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth, isFirebaseConfigured } from "./admin";

export const SESSION_COOKIE = "__session";
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export type StaffUser = { uid: string; email: string | null };

export async function getSessionUser(): Promise<StaffUser | null> {
  if (!isFirebaseConfigured()) return null;

  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (!value) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(value, true);
    if (decoded.staff !== true) return null;
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

export async function requireStaff(): Promise<StaffUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authorized — please sign in.");
  return user;
}
