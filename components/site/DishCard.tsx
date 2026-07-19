import Image from "next/image";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatNaira, photoLabel } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

const stripedPlaceholder =
  "repeating-linear-gradient(135deg, var(--color-surface-2), var(--color-surface-2) 10px, color-mix(in srgb, var(--color-surface-2) 70%, black) 10px, color-mix(in srgb, var(--color-surface-2) 70%, black) 20px)";

export function DishCard({ item }: { item: MenuItem }) {
  const soldOut = !item.available;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-card bg-surface shadow-[0_0_0_1px_var(--color-divider)] transition-[transform,box-shadow] duration-200 ${
        soldOut
          ? "pointer-events-none opacity-40"
          : "hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35),0_0_0_1px_var(--color-divider)] motion-reduce:transform-none motion-reduce:transition-none"
      }`}
    >
      <div
        className="relative flex aspect-[16/10] items-center justify-center overflow-hidden"
        style={item.photoUrl ? undefined : { background: stripedPlaceholder }}
      >
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            sizes="(max-width: 720px) 100vw, 300px"
            className="object-cover"
          />
        ) : (
          <span className="px-2.5 text-center font-mono text-[10.5px] text-text-mute">
            photo: {photoLabel(item.name)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pt-3.5 pb-4">
        <div className="text-[15px] font-bold">{item.name}</div>
        {soldOut && (
          <div className="text-[10px] font-bold uppercase tracking-[0.06em] text-text-mute">
            Sold out
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <div className="text-[15px] font-extrabold text-gold">
            {formatNaira(item.price)}
          </div>
          <AddToCartButton
            item={{ id: item.id, name: item.name, price: item.price }}
            soldOut={soldOut}
          />
        </div>
      </div>
    </div>
  );
}
