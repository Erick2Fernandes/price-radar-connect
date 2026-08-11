import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface ListItem { productId: string; qty: number }
export interface PriceAlert { productId: string; target: number }

interface State {
  role: "cliente" | "mercado" | null;
  guest: boolean;
  userName: string;
  list: ListItem[];
  favProducts: string[];
  favMarkets: string[];
  alerts: PriceAlert[];
  publishPrices: boolean;
  publishAvailability: boolean;
  minMargin: number;
}

const initial: State = {
  role: null, guest: false, userName: "Visitante",
  list: [{ productId: "p1", qty: 1 }, { productId: "p2", qty: 1 }, { productId: "p4", qty: 1 }, { productId: "p5", qty: 2 }, { productId: "p3", qty: 1 }],
  favProducts: ["p1", "p4"], favMarkets: ["m1", "m2"], alerts: [],
  publishPrices: true, publishAvailability: true, minMargin: 20,
};

interface Ctx extends State {
  set: <K extends keyof State>(k: K, v: State[K]) => void;
  addToList: (productId: string, qty?: number) => void;
  removeFromList: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  toggleFavProduct: (id: string) => void;
  toggleFavMarket: (id: string) => void;
  addAlert: (productId: string, target: number) => void;
  removeAlert: (productId: string) => void;
}

const PRContext = createContext<Ctx | null>(null);
const KEY = "precoradar-state-v1";

export function PRProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const set = useCallback(<K extends keyof State>(k: K, v: State[K]) => setState((s) => ({ ...s, [k]: v })), []);

  const value = useMemo<Ctx>(() => ({
    ...state,
    set,
    addToList: (productId, qty = 1) => setState((s) =>
      s.list.some((i) => i.productId === productId)
        ? { ...s, list: s.list.map((i) => i.productId === productId ? { ...i, qty: i.qty + qty } : i) }
        : { ...s, list: [...s.list, { productId, qty }] }),
    removeFromList: (productId) => setState((s) => ({ ...s, list: s.list.filter((i) => i.productId !== productId) })),
    setQty: (productId, qty) => setState((s) => ({ ...s, list: s.list.map((i) => i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i) })),
    toggleFavProduct: (id) => setState((s) => ({ ...s, favProducts: s.favProducts.includes(id) ? s.favProducts.filter((x) => x !== id) : [...s.favProducts, id] })),
    toggleFavMarket: (id) => setState((s) => ({ ...s, favMarkets: s.favMarkets.includes(id) ? s.favMarkets.filter((x) => x !== id) : [...s.favMarkets, id] })),
    addAlert: (productId, target) => setState((s) => ({ ...s, alerts: [...s.alerts.filter((a) => a.productId !== productId), { productId, target }] })),
    removeAlert: (productId) => setState((s) => ({ ...s, alerts: s.alerts.filter((a) => a.productId !== productId) })),
  }), [state, set]);

  return <PRContext.Provider value={value}>{children}</PRContext.Provider>;
}

export function usePR() {
  const ctx = useContext(PRContext);
  if (!ctx) throw new Error("usePR must be used inside PRProvider");
  return ctx;
}
