"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addCategory } from "@/app/admin/actions";
import type { MenuCategory } from "@/lib/types";
import { CategoryPanel } from "./CategoryPanel";

export function MenuManager({
  categories,
  enabled,
}: {
  categories: MenuCategory[];
  enabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleAddCategory() {
    const name = window.prompt("New category name");
    if (!name) return;
    startTransition(async () => {
      await addCategory(name);
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px]">Menu &amp; categories</h2>
        <button
          type="button"
          className="fh-btn fh-btn-primary"
          onClick={handleAddCategory}
          disabled={!enabled || pending}
        >
          + Add category
        </button>
      </div>

      {!enabled && (
        <div className="fh-note mb-5 rounded-md border border-[var(--fh-border)] bg-[#fff7e6] px-3 py-2">
          Menu editing needs a connected Supabase database (with the service-role key
          in <code>.env.local</code>). Currently showing read-only data.
        </div>
      )}

      {categories.map((category, i) => (
        <CategoryPanel
          key={category.id}
          category={category}
          enabled={enabled}
          isFirst={i === 0}
          isLast={i === categories.length - 1}
        />
      ))}
    </>
  );
}
