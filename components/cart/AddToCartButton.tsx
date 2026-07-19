"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  item,
  soldOut,
}: {
  item: { id: string; name: string; price: number };
  soldOut: boolean;
}) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleAdd() {
    add(item);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 700);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={soldOut}
      aria-label={`Add ${item.name} to cart`}
      data-added={justAdded ? "true" : undefined}
      className="addbtn addbtn--interactive"
    >
      <span aria-hidden>{justAdded ? "✓" : "+"}</span>
    </button>
  );
}
