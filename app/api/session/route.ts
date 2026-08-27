import { NextResponse } from "next/server";
import { getAdminAuth, isFirebaseConfigured } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  getSessionUser,
} from "@/lib/firebase/session";

const secure = process.env.NODE_ENV === "production";

export async function POST(request: Request) {
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!isFirebaseConfigured() || !apiKey) {
    return NextResponse.json(
      { error: "Firebase is not configured." },
      { status: 503 },
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const verified = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  if (!verified.ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const { idToken } = (await verified.json()) as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "Sign-in failed." }, { status: 401 });
  }

  const auth = getAdminAuth();

  try {
    const decoded = await auth.verifyIdToken(idToken);
    if (decoded.staff !== true) {
      return NextResponse.json(
        { error: "This account is not authorized for admin access." },
        { status: 403 },
      );
    }

    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({
      ok: true,
      email: decoded.email ?? null,
    });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Sign-in failed." }, { status: 401 });
  }
}

export async function DELETE() {
  const user = await getSessionUser();
  if (user) {
    try {
      await getAdminAuth().revokeRefreshTokens(user.uid);
    } catch {}
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
