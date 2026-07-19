"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  deleteItem,
  moveItem,
  setItemAvailability,
  updateItemName,
  updateItemPrice,
} from "@/app/admin/actions";
import type { MenuItem } from "@/lib/types";
import { PhotoCell } from "./PhotoCell";

export function ItemRow({
  item,
  categoryId,
  isFirst,
  isLast,
  enabled,
}: {
  item: MenuItem;
  categoryId: string;
  isFirst: boolean;
  isLast: boolean;
  enabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  function handleName(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.value.trim();
    if (name && name !== item.name) run(() => updateItemName(item.id, name));
  }

  function handlePrice(e: React.FocusEvent<HTMLInputElement>) {
    const price = Number(e.target.value);
    if (Number.isFinite(price) && price !== item.price) {
      run(() => updateItemPrice(item.id, price));
    }
  }

  return (
    <tr>
      <td>
        <PhotoCell item={item} enabled={enabled} />
      </td>

      <td>
        <input
          className="fh-input"
          defaultValue={item.name}
          onBlur={handleName}
          disabled={!enabled}
          aria-label="Item name"
        />
      </td>

      <td>
        <input
          className="fh-input max-w-[100px]"
          type="number"
          min={0}
          defaultValue={item.price}
          onBlur={handlePrice}
          disabled={!enabled}
          aria-label="Item price in Naira"
        />
      </td>

      <td>
        <button
          type="button"
          className="fh-toggle"
          onClick={() => run(() => setItemAvailability(item.id, !item.available))}
          disabled={!enabled || pending}
          aria-label={`Mark ${item.name} as ${item.available ? "sold out" : "available"}`}
        >
          <span className={item.available ? "fh-avail-on" : "fh-avail-off"}>
            {item.available ? "Available" : "Sold out"}
          </span>
        </button>
      </td>

      <td>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="fh-btn fh-btn-sm"
            onClick={() => run(() => moveItem(categoryId, item.id, -1))}
            disabled={!enabled || pending || isFirst}
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="fh-btn fh-btn-sm"
            onClick={() => run(() => moveItem(categoryId, item.id, 1))}
            disabled={!enabled || pending || isLast}
            aria-label="Move down"
          >
            ↓
          </button>
        </div>
      </td>

      <td>
        <button
          type="button"
          className="fh-btn fh-btn-sm fh-btn-danger"
          onClick={() => {
            if (window.confirm(`Delete "${item.name}"?`)) {
              run(() => deleteItem(item.id));
            }
          }}
          disabled={!enabled || pending}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
