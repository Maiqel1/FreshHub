"use server";

import { revalidatePath } from "next/cache";
import {
  CATEGORIES,
  ITEMS,
  PHOTO_PREFIX,
  getBucket,
  getDb,
} from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/firebase/session";
import { MAX_PHOTO_BYTES, MAX_PHOTO_LABEL } from "@/lib/limits";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refreshMenu() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/menu");
}

async function deletePhotos(paths: (string | null | undefined)[]) {
  const bucket = getBucket();
  await Promise.all(
    paths
      .filter((p): p is string => Boolean(p))
      .map((p) => bucket.file(p).delete().catch(() => {})),
  );
}

export async function addCategory(name: string) {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");

  const db = getDb();
  const last = await db
    .collection(CATEGORIES)
    .orderBy("sort_order", "desc")
    .limit(1)
    .get();
  const sort_order = last.empty ? 1 : (last.docs[0].data().sort_order as number) + 1;

  await db.collection(CATEGORIES).add({
    name: trimmed,
    sort_order,
    created_at: new Date().toISOString(),
  });
  refreshMenu();
}

export async function renameCategory(id: string, name: string) {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");

  await getDb().collection(CATEGORIES).doc(id).update({ name: trimmed });
  refreshMenu();
}

export async function deleteCategory(id: string) {
  await requireStaff();
  const db = getDb();

  const items = await db.collection(ITEMS).where("category_id", "==", id).get();

  const batch = db.batch();
  for (const doc of items.docs) batch.delete(doc.ref);
  batch.delete(db.collection(CATEGORIES).doc(id));
  await batch.commit();

  await deletePhotos(items.docs.map((d) => d.data().photo_path));
  refreshMenu();
}

export async function moveCategory(categoryId: string, dir: -1 | 1) {
  await requireStaff();
  const db = getDb();
  const snap = await db.collection(CATEGORIES).orderBy("sort_order").get();

  const idx = snap.docs.findIndex((d) => d.id === categoryId);
  const j = idx + dir;
  if (idx < 0 || j < 0 || j >= snap.docs.length) return;

  const a = snap.docs[idx];
  const b = snap.docs[j];
  const batch = db.batch();
  batch.update(a.ref, { sort_order: b.data().sort_order });
  batch.update(b.ref, { sort_order: a.data().sort_order });
  await batch.commit();
  refreshMenu();
}

export async function addItem(categoryId: string) {
  await requireStaff();
  const db = getDb();

  const last = await db
    .collection(ITEMS)
    .where("category_id", "==", categoryId)
    .orderBy("sort_order", "desc")
    .limit(1)
    .get();
  const sort_order = last.empty ? 1 : (last.docs[0].data().sort_order as number) + 1;

  await db.collection(ITEMS).add({
    category_id: categoryId,
    name: "New item",
    price: 0,
    available: true,
    sort_order,
    photo_path: null,
    created_at: new Date().toISOString(),
  });
  refreshMenu();
}

export async function updateItemName(id: string, name: string) {
  await requireStaff();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Item name is required.");

  await getDb().collection(ITEMS).doc(id).update({ name: trimmed });
  refreshMenu();
}

export async function updateItemPrice(id: string, price: number) {
  await requireStaff();
  const clean = Number.isFinite(price) && price >= 0 ? Math.round(price) : 0;

  await getDb().collection(ITEMS).doc(id).update({ price: clean });
  refreshMenu();
}

export async function setItemAvailability(id: string, available: boolean) {
  await requireStaff();
  await getDb().collection(ITEMS).doc(id).update({ available });
  refreshMenu();
}

export async function deleteItem(id: string) {
  await requireStaff();
  const db = getDb();
  const ref = db.collection(ITEMS).doc(id);

  const snap = await ref.get();
  await ref.delete();

  await deletePhotos([snap.data()?.photo_path]);
  refreshMenu();
}

export async function moveItem(categoryId: string, itemId: string, dir: -1 | 1) {
  await requireStaff();
  const db = getDb();
  const snap = await db
    .collection(ITEMS)
    .where("category_id", "==", categoryId)
    .orderBy("sort_order")
    .get();

  const idx = snap.docs.findIndex((d) => d.id === itemId);
  const j = idx + dir;
  if (idx < 0 || j < 0 || j >= snap.docs.length) return;

  const a = snap.docs[idx];
  const b = snap.docs[j];
  const batch = db.batch();
  batch.update(a.ref, { sort_order: b.data().sort_order });
  batch.update(b.ref, { sort_order: a.data().sort_order });
  await batch.commit();
  refreshMenu();
}

export async function uploadItemPhoto(
  itemId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireStaff();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Please choose an image file." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, error: `Image is too large (max ${MAX_PHOTO_LABEL}).` };
  }

  const db = getDb();
  const ref = db.collection(ITEMS).doc(itemId);
  const existing = await ref.get();
  if (!existing.exists) return { ok: false, error: "Item no longer exists." };
  const oldPath = existing.data()?.photo_path as string | null | undefined;

  const ext = (file.name.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const path = `${PHOTO_PREFIX}/${itemId}/${Date.now()}.${ext || "jpg"}`;
  const bucket = getBucket();

  try {
    const object = bucket.file(path);
    await object.save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      resumable: false,
    });
    // Without this the object uploads fine but returns 403 to the browser.
    await object.makePublic();
  } catch (error) {
    await deletePhotos([path]);
    return { ok: false, error: `Upload failed: ${(error as Error).message}` };
  }

  try {
    await ref.update({ photo_path: path });
  } catch (error) {
    await deletePhotos([path]);
    return {
      ok: false,
      error: `Could not save photo: ${(error as Error).message}`,
    };
  }

  if (oldPath && oldPath !== path) await deletePhotos([oldPath]);
  refreshMenu();
  return { ok: true };
}

export async function removeItemPhoto(itemId: string): Promise<ActionResult> {
  await requireStaff();
  const ref = getDb().collection(ITEMS).doc(itemId);
  const existing = await ref.get();
  const path = existing.data()?.photo_path as string | null | undefined;

  try {
    await ref.update({ photo_path: null });
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  await deletePhotos([path]);
  refreshMenu();
  return { ok: true };
}
