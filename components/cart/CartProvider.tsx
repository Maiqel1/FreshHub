"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  add: (item: { id: string; name: string; price: number }) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "freshhub_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, CartLine>>({});
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback(
    (item: { id: string; name: string; price: number }) => {
      setItems((prev) => {
        const existing = prev[item.id];
        return {
          ...prev,
          [item.id]: existing
            ? { ...existing, qty: existing.qty + 1 }
            : { ...item, qty: 1 },
        };
      });
    },
    [],
  );

  const inc = useCallback((id: string) => {
    setItems((prev) => {
      const line = prev[id];
      if (!line) return prev;
      return { ...prev, [id]: { ...line, qty: line.qty + 1 } };
    });
  }, []);

  const dec = useCallback((id: string) => {
    setItems((prev) => {
      const line = prev[id];
      if (!line) return prev;
      const qty = line.qty - 1;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...line, qty } };
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = Object.values(items);
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const total = lines.reduce((sum, l) => sum + l.qty * l.price, 0);
    return {
      lines,
      count,
      total,
      open,
      add,
      inc,
      dec,
      remove,
      clear,
      setOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
    };
  }, [items, open, add, inc, dec, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
