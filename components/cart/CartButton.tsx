"use client";

import { useCart } from "./CartProvider";
import { CartCountBadge } from "./CartCountBadge";

export function CartButton() {
  const { count, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="btn btn-outline"
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      Cart <CartCountBadge count={count} />
    </button>
  );
}
