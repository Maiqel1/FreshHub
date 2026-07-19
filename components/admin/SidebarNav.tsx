"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Menu & Categories" },
];

export function SidebarNav({
  onNavigate,
  userEmail,
}: {
  onNavigate?: () => void;
  userEmail?: string | null;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  async function handleSignOut() {
    await createSupabaseBrowserClient().auth.signOut();
    onNavigate?.();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col gap-1">
      <div className="fh-brand">
        <span className="fh-brand-mark" aria-hidden />
        FreshHub Admin
      </div>
      {items.map((it) => {
        const active =
          it.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={onNavigate}
            className={`fh-navitem ${active ? "active" : ""}`}
          >
            {it.label}
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col gap-1">
        {userEmail && (
          <div
            className="truncate px-3 pt-2 text-[11px] text-[var(--fh-mute)]"
            title={userEmail}
          >
            {userEmail}
          </div>
        )}
        {userEmail && (
          <button
            type="button"
            onClick={handleSignOut}
            className="fh-navitem"
          >
            Sign out
          </button>
        )}
        <Link className="fh-backlink" href="/" onClick={onNavigate}>
          ← Back to public menu
        </Link>
      </div>
    </div>
  );
}
