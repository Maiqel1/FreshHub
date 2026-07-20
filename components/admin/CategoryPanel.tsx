"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  addItem,
  deleteCategory,
  moveCategory,
  renameCategory,
} from "@/app/admin/actions";
import type { MenuCategory } from "@/lib/types";
import { useConfirm } from "./ConfirmProvider";
import { ItemRow } from "./ItemRow";

export function CategoryPanel({
  category,
  enabled,
  isFirst,
  isLast,
}: {
  category: MenuCategory;
  enabled: boolean;
  isFirst: boolean;
  isLast: boolean;
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

  function handleRename(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.value.trim();
    if (name && name !== category.name)
      run(() => renameCategory(category.id, name), "Category renamed");
  }

  async function handleDelete() {
    const ok = await confirm({
      title: `Delete “${category.name}”?`,
      description: "This permanently removes the category and every item in it.",
      confirmLabel: "Delete category",
      danger: true,
    });
    if (ok) run(() => deleteCategory(category.id), "Category deleted");
  }

  return (
    <div className="fh-panel">
      <div className="fh-panel-head flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col">
            <button
              type="button"
              className="fh-btn fh-btn-sm px-2 py-0.5 leading-none"
              onClick={() => run(() => moveCategory(category.id, -1))}
              disabled={!enabled || pending || isFirst}
              aria-label={`Move ${category.name} up`}
            >
              ↑
            </button>
            <button
              type="button"
              className="fh-btn fh-btn-sm px-2 py-0.5 leading-none"
              onClick={() => run(() => moveCategory(category.id, 1))}
              disabled={!enabled || pending || isLast}
              aria-label={`Move ${category.name} down`}
            >
              ↓
            </button>
          </div>
          <input
            className="fh-input max-w-[240px] font-bold"
            defaultValue={category.name}
            onBlur={handleRename}
            disabled={!enabled}
            aria-label="Category name"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="fh-btn fh-btn-sm"
            onClick={() => run(() => addItem(category.id), "Item added")}
            disabled={!enabled || pending}
          >
            + Item
          </button>
          <button
            type="button"
            className="fh-btn fh-btn-sm fh-btn-danger"
            onClick={handleDelete}
            disabled={!enabled || pending}
          >
            Delete category
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="fh-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Price (₦)</th>
              <th>Available</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {category.items.map((item, i) => (
              <ItemRow
                key={item.id}
                item={item}
                categoryId={category.id}
                isFirst={i === 0}
                isLast={i === category.items.length - 1}
                enabled={enabled}
              />
            ))}
            {category.items.length === 0 && (
              <tr>
                <td colSpan={6} className="fh-note">
                  No items yet — use “+ Item”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
