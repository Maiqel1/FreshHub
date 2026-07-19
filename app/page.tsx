import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartFab } from "@/components/cart/CartFab";
import { CartProvider } from "@/components/cart/CartProvider";
import { CategorySection } from "@/components/site/CategorySection";
import { ChipBar } from "@/components/site/ChipBar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { SeedBadge } from "@/components/site/SeedBadge";
import { getMenu } from "@/lib/menu";

export default async function Home() {
  const { categories, source } = await getMenu();

  return (
    <CartProvider>
      <Nav categories={categories} />
      <Hero categories={categories} />
      <ChipBar categories={categories} />
      <main>
        {categories.map((category, index) => (
          <CategorySection key={category.id} category={category} index={index} />
        ))}
      </main>
      <Footer />
      <CartFab />
      <CartDrawer />
      {source === "seed" && <SeedBadge />}
    </CartProvider>
  );
}
