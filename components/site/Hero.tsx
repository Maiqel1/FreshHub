import { categorySlug } from "@/lib/format";
import type { MenuCategory } from "@/lib/types";
import { Reveal } from "./Reveal";

export function Hero({ categories }: { categories: MenuCategory[] }) {
  const firstHref = categories[0]
    ? `#menu-${categorySlug(categories[0].name)}`
    : "#menu";

  return (
    <header
      id="top"
      className="relative overflow-hidden px-5 pt-14 pb-14 md:px-10 md:pt-[88px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[140px] -top-[140px] h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-orange) 28%, transparent), transparent 70%)",
        }}
      />
      <Reveal className="relative mx-auto max-w-[1180px]">
        <h1 className="max-w-[680px] text-[40px] leading-[1.03] md:text-[64px]">
          Fresh food, made&nbsp;to order.
        </h1>
        <p className="mt-4 max-w-[480px] text-[17px] text-text-mute">
          Rice, grills, shawarma, combos and smoothies — cooked fresh and ready when
          you are. Order online, we&apos;ll confirm on WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a className="btn btn-solid" href={firstHref}>
            View menu
          </a>
          <a className="btn btn-outline" href="#location">
            Hours &amp; location
          </a>
        </div>
      </Reveal>
    </header>
  );
}
