"use client";

import { useEffect, useRef, useState } from "react";
import { categorySlug } from "@/lib/format";
import type { MenuCategory } from "@/lib/types";

export function ChipBar({ categories }: { categories: MenuCategory[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    categories[0] ? categorySlug(categories[0].name) : null,
  );
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`menu-${categorySlug(c.name)}`))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSlug(visible[0].target.id.replace("menu-", ""));
        }
      },
      { rootMargin: "-118px 0px -72% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    if (!activeSlug) return;
    const chip = chipRefs.current[activeSlug];
    if (!chip) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    chip.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeSlug]);

  return (
    <div className="sticky top-16 z-20 border-b border-divider bg-bg">
      <div className="no-scrollbar mx-auto flex max-w-[1180px] gap-2.5 overflow-x-auto px-5 py-3.5 md:px-10">
        {categories.map((c) => {
          const slug = categorySlug(c.name);
          return (
            <a
              key={c.id}
              ref={(el) => {
                chipRefs.current[slug] = el;
              }}
              href={`#menu-${slug}`}
              onClick={() => setActiveSlug(slug)}
              aria-current={activeSlug === slug ? "true" : undefined}
              className={`chip ${activeSlug === slug ? "active" : ""}`}
            >
              {c.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
