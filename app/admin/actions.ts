"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PHOTO_BUCKET } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

async function assertStaff() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authorized — please sign in.");
}

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function refreshMenu() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/menu");
}

export async function addCategory(name: string) {
  await assertStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  const supabase = createSupabaseAdminClient();
  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const sort_order = last && last[0] ? last[0].sort_order + 1 : 1;
  const { error } = await supabase
    .from("categories")
    .insert({ name: trimmed, sort_order });
  check(error);
  refreshMenu();
}

export async function renameCategory(id: string, name: string) {
  await assertStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed })
    .eq("id", id);
  check(error);
  refreshMenu();
}

export async function deleteCategory(id: string) {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  check(error);
  refreshMenu();
}

export async function moveCategory(categoryId: string, dir: -1 | 1) {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { data: cats } = await supabase
    .from("categories")
    .select("id,sort_order")
    .order("sort_order", { ascending: true });
  if (!cats) return;

  const idx = cats.findIndex((c) => c.id === categoryId);
  const j = idx + dir;
  if (idx < 0 || j < 0 || j >= cats.length) return;

  const a = cats[idx];
  const b = cats[j];
  check(
    (await supabase.from("categories").update({ sort_order: b.sort_order }).eq("id", a.id)).error,
  );
  check(
    (await supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", b.id)).error,
  );
  refreshMenu();
}

export async function addItem(categoryId: string) {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { data: last } = await supabase
    .from("items")
    .select("sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const sort_order = last && last[0] ? last[0].sort_order + 1 : 1;
  const { error } = await supabase.from("items").insert({
    category_id: categoryId,
    name: "New item",
    price: 0,
    available: true,
    sort_order,
  });
  check(error);
  refreshMenu();
}

export async function updateItemName(id: string, name: string) {
  await assertStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Item name is required.");
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("items")
    .update({ name: trimmed })
    .eq("id", id);
  check(error);
  refreshMenu();
}

export async function updateItemPrice(id: string, price: number) {
  await assertStaff();
  const clean = Number.isFinite(price) && price >= 0 ? Math.round(price) : 0;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("items")
    .update({ price: clean })
    .eq("id", id);
  check(error);
  refreshMenu();
}

export async function setItemAvailability(id: string, available: boolean) {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("items")
    .update({ available })
    .eq("id", id);
  check(error);
  refreshMenu();
}

export async function deleteItem(id: string) {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("items").delete().eq("id", id);
  check(error);
  refreshMenu();
}

export async function moveItem(categoryId: string, itemId: string, dir: -1 | 1) {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { data: items } = await supabase
    .from("items")
    .select("id,sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });
  if (!items) return;

  const idx = items.findIndex((i) => i.id === itemId);
  const j = idx + dir;
  if (idx < 0 || j < 0 || j >= items.length) return;

  const a = items[idx];
  const b = items[j];
  check(
    (await supabase.from("items").update({ sort_order: b.sort_order }).eq("id", a.id)).error,
  );
  check(
    (await supabase.from("items").update({ sort_order: a.sort_order }).eq("id", b.id)).error,
  );
  refreshMenu();
}

export async function uploadItemPhoto(
  itemId: string,
  formData: FormData,
): Promise<ActionResult> {
  await assertStaff();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Please choose an image file." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, error: "Image is too large (max 5 MB)." };
  }

  const supabase = createSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("items")
    .select("photo_path")
    .eq("id", itemId)
    .single();
  const oldPath = existing?.photo_path as string | null | undefined;

  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const path = `${itemId}/${Date.now()}.${ext || "jpg"}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (uploadError) {
    return { ok: false, error: `Upload failed: ${uploadError.message}` };
  }

  const { error: updateError } = await supabase
    .from("items")
    .update({ photo_path: path })
    .eq("id", itemId);
  if (updateError) {
    await supabase.storage.from(PHOTO_BUCKET).remove([path]);
    return { ok: false, error: `Could not save photo: ${updateError.message}` };
  }

  if (oldPath && oldPath !== path) {
    await supabase.storage.from(PHOTO_BUCKET).remove([oldPath]);
  }

  refreshMenu();
  return { ok: true };
}

export async function removeItemPhoto(itemId: string): Promise<ActionResult> {
  await assertStaff();
  const supabase = createSupabaseAdminClient();
  const { data: existing } = await supabase
    .from("items")
    .select("photo_path")
    .eq("id", itemId)
    .single();
  const path = existing?.photo_path as string | null | undefined;

  const { error } = await supabase
    .from("items")
    .update({ photo_path: null })
    .eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  if (path) {
    await supabase.storage.from(PHOTO_BUCKET).remove([path]);
  }
  refreshMenu();
  return { ok: true };
}
