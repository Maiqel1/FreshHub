import {
  CATEGORIES,
  ITEMS,
  getDb,
  isFirebaseConfigured,
  photoPublicUrl,
} from "./firebase/admin";
import { DEFAULT_CATEGORIES } from "./menu-data";
import type { MenuCategory, MenuItem } from "./types";

export type MenuResult = {
  categories: MenuCategory[];
  source: "firebase" | "seed";
};

function seedCategories(): MenuCategory[] {
  return DEFAULT_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    items: c.items.map((it) => ({
      id: it.id,
      name: it.n,
      price: it.p,
      available: it.avail,
      photoUrl: null,
    })),
  }));
}

type ItemDoc = {
  category_id: string;
  name: string;
  price: number;
  available: boolean;
  photo_path: string | null;
  sort_order: number;
};

export async function getMenu(): Promise<MenuResult> {
  if (!isFirebaseConfigured()) {
    return { categories: seedCategories(), source: "seed" };
  }

  try {
    const db = getDb();
    const [categorySnap, itemSnap] = await Promise.all([
      db.collection(CATEGORIES).orderBy("sort_order").get(),
      db.collection(ITEMS).orderBy("sort_order").get(),
    ]);

    if (categorySnap.empty) {
      return { categories: seedCategories(), source: "seed" };
    }

    const byCategory = new Map<string, MenuItem[]>();
    for (const doc of itemSnap.docs) {
      const data = doc.data() as ItemDoc;
      const list = byCategory.get(data.category_id) ?? [];
      list.push({
        id: doc.id,
        name: data.name,
        price: data.price,
        available: data.available,
        photoUrl: data.photo_path ? photoPublicUrl(data.photo_path) : null,
      });
      byCategory.set(data.category_id, list);
    }

    const categories: MenuCategory[] = categorySnap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
      items: byCategory.get(doc.id) ?? [],
    }));

    return { categories, source: "firebase" };
  } catch {
    return { categories: seedCategories(), source: "seed" };
  }
}
