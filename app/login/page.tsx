"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {off ? (
        <>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.12 9.12 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
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
        <div className="relative mt-1">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-black/15 bg-[#f4f1ec] py-2 pl-3 pr-10 text-[14px] outline-none focus-visible:border-[#8a1457]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-black/45 hover:text-black/75"
          >
            <EyeIcon off={showPassword} />
          </button>
        </div>

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
