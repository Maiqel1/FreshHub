"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { ConfirmProvider } from "./ConfirmProvider";
import { SidebarNav } from "./SidebarNav";

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[220px_1fr]">
      <aside className="hidden border-r border-[var(--fh-border)] bg-[var(--fh-panel)] px-4 py-[22px] md:sticky md:top-0 md:block md:h-screen md:overflow-y-auto">
        <SidebarNav userEmail={userEmail} />
      </aside>

      <div className="min-w-0">
        <div className="flex h-14 items-center gap-3 border-b border-[var(--fh-border)] bg-[var(--fh-panel)] px-4 md:hidden">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              className="fh-btn fh-btn-sm"
              aria-label="Open navigation"
            >
              ☰
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="cart-overlay fixed inset-0 z-50 bg-black/40" />
              <Dialog.Content
                className="fh-admin fh-drawer fixed inset-y-0 left-0 z-[51] w-[240px] border-r border-[var(--fh-border)] bg-[var(--fh-panel)] px-4 py-[22px] shadow-[10px_0_40px_rgba(0,0,0,0.15)]"
                aria-describedby={undefined}
              >
                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                <SidebarNav
                  userEmail={userEmail}
                  onNavigate={() => setOpen(false)}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <div className="fh-brand !p-0">
            <span className="fh-brand-mark" aria-hidden />
            FreshHub Admin
          </div>
        </div>

        <main className="px-5 py-6 md:px-10 md:py-8">
          <ConfirmProvider>{children}</ConfirmProvider>
        </main>
      </div>
    </div>
  );
}
