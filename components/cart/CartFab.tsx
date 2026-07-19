"use client";

import { useCart } from "./CartProvider";
import { CartCountBadge } from "./CartCountBadge";

export function CartFab() {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open your order, ${count} item${count === 1 ? "" : "s"}`}
      className="fab-in fixed bottom-7 right-7 z-40 flex items-center gap-2.5 rounded-pill bg-gold px-5 py-3.5 text-[14px] font-extrabold text-[#2c1900] shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-transform duration-150 hover:scale-[1.03] active:scale-95 motion-reduce:transition-none"
    >
      <span aria-hidden>🛒</span> Your order <CartCountBadge count={count} />
    </button>
  );
}
