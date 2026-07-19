import { categorySlug } from "@/lib/format";
import type { MenuCategory } from "@/lib/types";
import { DishCard } from "./DishCard";
import { Reveal } from "./Reveal";

export function CategorySection({
  category,
  index,
}: {
  category: MenuCategory;
  index: number;
}) {
  const kicker = `Category ${String(index + 1).padStart(2, "0")}`;

  return (
    <section
      id={`menu-${categorySlug(category.name)}`}
      className="scroll-mt-[132px] px-5 pt-16 pb-2 md:px-10"
    >
      <Reveal className="mx-auto max-w-[1180px]">
        <h6 className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
          {kicker}
        </h6>
        <h2 className="mb-6 text-[32px]">{category.name}</h2>
        <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {category.items.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
