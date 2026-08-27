import { MenuManager } from "@/components/admin/MenuManager";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getMenu } from "@/lib/menu";

export const dynamic = "force-dynamic";

export default async function MenuAdminPage() {
  const { categories, source } = await getMenu();
  const enabled = isFirebaseConfigured() && source === "firebase";
  return <MenuManager categories={categories} enabled={enabled} />;
}
