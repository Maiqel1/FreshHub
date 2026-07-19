"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ec] px-6 text-[#221022]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[10px] border border-black/10 bg-white p-8"
      >
        <div className="mb-6 flex items-center gap-2.5">
          <span
            className="h-7 w-7 rounded-full"
            style={{
              background:
                "conic-gradient(from -40deg, #f3ca2b, #f28c1e 45%, #f3ca2b 100%)",
            }}
          />
          <span className="text-[18px] font-extrabold">FreshHub Admin</span>
        </div>
        <h1 className="text-[15px] font-semibold text-black/60">Staff sign in</h1>

        {!configured && (
          <p className="mt-4 rounded-md border border-black/10 bg-[#fff7e6] px-3 py-2 text-[12px] text-black/60">
            Supabase isn&apos;t configured — set the env vars in <code>.env.local</code>{" "}
            to enable login.
          </p>
        )}

        <label className="mt-5 block text-[13px] font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/15 bg-[#f4f1ec] px-3 py-2 text-[14px] outline-none focus-visible:border-[#8a1457]"
        />

        <label className="mt-4 block text-[13px] font-semibold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/15 bg-[#f4f1ec] px-3 py-2 text-[14px] outline-none focus-visible:border-[#8a1457]"
        />

        {error && (
          <p className="mt-3 text-[13px] font-medium text-[#b3261e]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !configured}
          className="mt-6 w-full rounded-md bg-[#8a1457] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#701146] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <Link
          href="/"
          className="mt-4 block text-center text-[13px] font-semibold text-[#8a1457] hover:underline"
        >
          ← Back to public menu
        </Link>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
