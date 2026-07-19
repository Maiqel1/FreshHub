"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { removeItemPhoto, uploadItemPhoto } from "@/app/admin/actions";
import type { MenuItem } from "@/lib/types";

export function PhotoCell({
  item,
  enabled,
}: {
  item: MenuItem;
  enabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    startTransition(async () => {
      const res = await uploadItemPhoto(item.id, fd);
      if (!res.ok) setError(res.error);
      router.refresh();
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      await removeItemPhoto(item.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <label
        className={`fh-thumbcell ${enabled ? "is-clickable" : ""}`}
        title={enabled ? "Click to upload or replace photo" : undefined}
      >
        {item.photoUrl && <img src={item.photoUrl} alt={item.name} />}
        {pending && (
          <span className="fh-cell-overlay" aria-hidden>
            <span className="fh-spinner" />
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={!enabled || pending}
          aria-label={`Upload photo for ${item.name}`}
        />
      </label>

      {item.photoUrl && enabled && (
        <button
          type="button"
          className="fh-btn fh-btn-sm fh-btn-danger"
          onClick={handleRemove}
          disabled={pending}
          title="Remove photo"
          aria-label={`Remove photo for ${item.name}`}
        >
          ✕
        </button>
      )}
      {error && (
        <span className="text-[11px]" style={{ color: "var(--fh-danger)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
