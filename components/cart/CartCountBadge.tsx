"use client";

import { useEffect, useRef, useState } from "react";

export function CartCountBadge({ count }: { count: number }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(count);

  useEffect(() => {
    if (count !== prev.current) {
      prev.current = count;
      if (count > 0) {
        setBump(true);
        const t = setTimeout(() => setBump(false), 350);
        return () => clearTimeout(t);
      }
    }
  }, [count]);

  return (
    <span
      className="inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-[#2c1900] px-[5px] text-[11px] font-bold text-gold"
      style={bump ? { animation: "cart-badge-bump 0.35s ease" } : undefined}
    >
      {count}
    </span>
  );
}
