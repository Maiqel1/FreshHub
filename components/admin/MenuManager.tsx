"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      try {
        await addCategory(trimmed);
        router.refresh();
        setName("");
        setOpen(false);
        toast.success("Category added");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not add category");
      }
    });
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px]">Menu &amp; categories</h2>
        <button
          type="button"
          className="fh-btn fh-btn-primary"
          onClick={() => setOpen(true)}
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

      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setName("");
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fh-modal-overlay fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content
            className="fh-modal fixed left-1/2 top-1/2 z-[61] w-[min(400px,92vw)] rounded-[10px] border border-[var(--fh-border)] bg-[var(--fh-panel)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            aria-describedby={undefined}
          >
            <Dialog.Title className="text-[16px] font-extrabold text-[var(--fh-text)]">
              New category
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              <input
                autoFocus
                className="fh-input mt-4"
                placeholder="e.g. Wraps"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="mt-6 flex justify-end gap-2">
                <Dialog.Close type="button" className="fh-btn">
                  Cancel
                </Dialog.Close>
                <button
                  type="submit"
                  className="fh-btn fh-btn-primary"
                  disabled={!name.trim() || pending}
                >
                  Add category
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
