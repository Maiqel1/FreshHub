import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/firebase/session";
import "./admin.css";

export const metadata: Metadata = {
  title: "FreshHub Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;

  if (isFirebaseConfigured()) {
    const user = await getSessionUser();
    if (!user) redirect("/login");
    userEmail = user.email;
  }

  return (
    <div className="fh-admin">
      <AdminShell userEmail={userEmail}>{children}</AdminShell>
    </div>
  );
}
