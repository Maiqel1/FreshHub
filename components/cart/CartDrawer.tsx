"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { formatNaira } from "@/lib/format";
import { contact, externalOrderLinks, whatsappLink } from "@/lib/links";
import { useCart, type CartLine } from "./CartProvider";

function buildWhatsappMessage(lines: CartLine[], total: number): string {
  if (lines.length === 0) {
    return "Hi FreshHub, I'd like to place an order.";
  }
  const body = lines
    .map((l) => `${l.qty}x ${l.name} — ${formatNaira(l.qty * l.price)}`)
    .join("\n");
  return `Hi FreshHub, I'd like to order:\n${body}\nTotal: ${formatNaira(total)}`;
}

export function CartDrawer() {
  const { lines, total, open, setOpen, inc, dec } = useCart();
  const isEmpty = lines.length === 0;
  const waLink = whatsappLink(buildWhatsappMessage(lines, total));

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="cart-overlay fixed inset-0 z-50 bg-black/55" />
        <Dialog.Content
          className="cart-sheet fixed inset-y-0 right-0 z-[51] flex w-[min(420px,92vw)] flex-col bg-bg-2 shadow-[-20px_0_40px_rgba(0,0,0,0.4)]"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-divider px-[22px] py-5">
            <Dialog.Title className="text-[18px] font-extrabold">
              Your order
            </Dialog.Title>
            <Dialog.Close
              className="btn btn-outline px-2.5 py-1.5"
              aria-label="Close cart"
            >
              ✕
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-[22px] py-3">
            {isEmpty ? (
              <p className="py-6 text-center text-[14px] text-text-mute">
                Your cart is empty — add something delicious.
              </p>
            ) : (
              lines.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-2.5 border-b border-divider py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-semibold">
                      {l.name}
                    </div>
                    <div className="text-[12px] text-text-mute">
                      {formatNaira(l.price)} each
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => dec(l.id)}
                      aria-label={`Remove one ${l.name}`}
                      className="h-6 w-6 rounded-md border border-divider text-text transition-colors hover:bg-white/5"
                    >
                      −
                    </button>
                    <span className="min-w-4 text-center tabular-nums">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => inc(l.id)}
                      aria-label={`Add one ${l.name}`}
                      className="h-6 w-6 rounded-md border border-divider text-text transition-colors hover:bg-white/5"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2.5 border-t border-divider px-[22px] pb-6 pt-4">
            <div className="flex justify-between text-[16px] font-extrabold">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
            <a
              className="btn btn-solid"
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order via WhatsApp
            </a>
            <a className="btn btn-outline" href={`tel:${contact.phoneTel}`}>
              Call to order
            </a>
            <a
              className="btn btn-outline"
              href={externalOrderLinks.glovo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on Glovo
            </a>
            <a
              className="btn btn-outline"
              href={externalOrderLinks.chowdeck}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order on Chowdeck
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
