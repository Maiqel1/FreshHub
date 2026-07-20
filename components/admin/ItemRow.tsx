"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  deleteItem,
  moveItem,
  setItemAvailability,
  updateItemName,
  updateItemPrice,
} from "@/app/admin/actions";
import type { MenuItem } from "@/lib/types";
import { useConfirm } from "./ConfirmProvider";
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
  const confirm = useConfirm();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>, success?: string) =>
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
        if (success) toast.success(success);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong");
      }
    });

  async function handleDelete() {
    const ok = await confirm({
      title: `Delete “${item.name}”?`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (ok) run(() => deleteItem(item.id), "Item deleted");
  }

  function handleName(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.value.trim();
    if (name && name !== item.name)
      run(() => updateItemName(item.id, name), "Item renamed");
  }

  function handlePrice(e: React.FocusEvent<HTMLInputElement>) {
    const price = Number(e.target.value);
    if (Number.isFinite(price) && price !== item.price) {
      run(() => updateItemPrice(item.id, price), "Price updated");
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
          onClick={() =>
            run(
              () => setItemAvailability(item.id, !item.available),
              item.available ? "Marked sold out" : "Marked available",
            )
          }
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
          onClick={handleDelete}
          disabled={!enabled || pending}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
