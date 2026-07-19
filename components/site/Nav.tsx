import { CartButton } from "@/components/cart/CartButton";
import { categorySlug } from "@/lib/format";
import type { MenuCategory } from "@/lib/types";
import { Logo } from "./Logo";

function navLinks(categories: MenuCategory[]) {
  const find = (name: string) =>
    categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  const menu = categories[0];
  const combos = find("Combos");
  const drinks = find("Smoothies") ?? find("Fresh Juice") ?? find("Milkshakes");

  const links: { label: string; href: string }[] = [];
  if (menu) links.push({ label: "Menu", href: `#menu-${categorySlug(menu.name)}` });
  if (combos)
    links.push({ label: "Combos", href: `#menu-${categorySlug(combos.name)}` });
  if (drinks)
    links.push({ label: "Drinks", href: `#menu-${categorySlug(drinks.name)}` });
  links.push({ label: "Location", href: "#location" });
  return links;
}

export function Nav({ categories }: { categories: MenuCategory[] }) {
  const links = navLinks(categories);

  return (
    <nav className="sticky top-0 z-30 border-b border-divider bg-bg/[0.88] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-7 px-5 md:px-10">
        <a href="#top" className="mr-auto" aria-label="FreshHub — home">
          <Logo />
        </a>
        <div className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[13px] font-semibold text-text-mute transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </div>
        <CartButton />
      </div>
    </nav>
  );
}
