"use client";

/**
 * Guest-friendly shopping cart — React context + localStorage persistence.
 *
 * Props-driven slice (R3): no Convex imports. `price` is a NUMBER in the
 * smallest display unit (IDR rupiah, no cents); the host resolves it from
 * its own catalog before calling `add()`. Server MUST re-price on checkout
 * (never trust the client subtotal — see the host's placeOrder action).
 */

import * as React from "react";

export interface CartItem {
  /** Catalog slug — the cart identity key AND what the server re-prices by. */
  slug: string;
  name: string;
  /** Unit price in IDR (display + client-side subtotal only). */
  price: number;
  priceLabel: string;
  qty: number;
  emoji?: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  /** Total item count (Σ qty). */
  count: number;
  /** Client-side subtotal in IDR — display only; server re-prices. */
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "storefront-cart";
const MAX_QTY = 99;

function clampQty(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.round(qty)));
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CartProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
}: {
  children: React.ReactNode;
  storageKey?: string;
}) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  // SSR-safe hydrate: render empty on the server, load after mount.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.slug));
      }
    } catch {
      // corrupt storage → start empty
    }
    setHydrated(true);
  }, [storageKey]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // storage full/blocked → cart stays in-memory
    }
  }, [items, hydrated, storageKey]);

  const add = React.useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, qty: clampQty(i.qty + qty) } : i,
        );
      }
      return [...prev, { ...item, qty: clampQty(qty) }];
    });
  }, []);

  const setQty = React.useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty: clampQty(qty) } : i)),
    );
  }, []);

  const remove = React.useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const value = React.useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    return { items, count, subtotal, add, setQty, remove, clear };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
