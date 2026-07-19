import { DEFAULT_CATEGORIES } from "./menu-data";
import { isSupabaseConfigured, PHOTO_BUCKET } from "./supabase/config";
import { createSupabaseServerClient } from "./supabase/server";
import type { MenuCategory } from "./types";

export type MenuResult = {
  categories: MenuCategory[];
  source: "supabase" | "seed";
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

type ItemRow = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  photo_path: string | null;
  sort_order: number;
};
type CategoryRow = {
  id: string;
  name: string;
  sort_order: number;
  items: ItemRow[] | null;
};

export async function getMenu(): Promise<MenuResult> {
  if (!isSupabaseConfigured()) {
    return { categories: seedCategories(), source: "seed" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,sort_order,items(id,name,price,available,photo_path,sort_order)")
      .order("sort_order", { ascending: true })
      .order("sort_order", { referencedTable: "items", ascending: true });

    if (error || !data || data.length === 0) {
      return { categories: seedCategories(), source: "seed" };
    }

    const categories: MenuCategory[] = (data as CategoryRow[]).map((c) => ({
      id: c.id,
      name: c.name,
      items: (c.items ?? []).map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        available: it.available,
        photoUrl: it.photo_path
          ? supabase.storage.from(PHOTO_BUCKET).getPublicUrl(it.photo_path).data
              .publicUrl
          : null,
      })),
    }));

    return { categories, source: "supabase" };
  } catch {
    return { categories: seedCategories(), source: "seed" };
  }
}
