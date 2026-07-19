import { MenuManager } from "@/components/admin/MenuManager";
import { getMenu } from "@/lib/menu";
import { isAdminEnabled } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function MenuAdminPage() {
  const { categories, source } = await getMenu();
  const enabled = isAdminEnabled() && source === "supabase";
  return <MenuManager categories={categories} enabled={enabled} />;
}
