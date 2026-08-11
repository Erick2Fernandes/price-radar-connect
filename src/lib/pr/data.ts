export type Category =
  | "Mercearia" | "Bebidas" | "Laticínios" | "Higiene" | "Limpeza" | "Hortifruti" | "Carnes";

export type Availability = "available" | "low" | "out" | "not_carried" | "stale";

export interface Product {
  id: string;
  ean: string;
  name: string;
  brand: string;
  category: Category;
  size: string;
  emoji: string;
  cost: number;
}

export interface Market {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
  distanceKm: number;
  open: boolean;
  rating: number;
  publishPrices: boolean;
}

export interface Offer {
  marketId: string;
  productId: string;
  price: number;
  stock: number;
  status: Availability;
  updatedMinutesAgo: number;
}

export const MY_MARKET_ID = "m-aurora-mine";

export const markets: Market[] = [
  { id: "m1", name: "Mercado Aurora", address: "Av. Senador Salgado Filho, 1240", city: "Viamão, RS", hours: "07h – 22h", distanceKm: 1.8, open: true, rating: 4.7, publishPrices: true },
  { id: "m2", name: "Boa Compra", address: "Rua Cel. Marcos, 320", city: "Viamão, RS", hours: "08h – 21h", distanceKm: 2.4, open: true, rating: 4.4, publishPrices: true },
  { id: "m3", name: "Rede Central", address: "Av. Pres. Vargas, 78", city: "Viamão, RS", hours: "07h – 23h", distanceKm: 3.1, open: true, rating: 4.2, publishPrices: true },
  { id: "m4", name: "Mercado Popular", address: "Rua das Acácias, 55", city: "Viamão, RS", hours: "08h – 20h", distanceKm: 3.7, open: false, rating: 4.0, publishPrices: true },
  { id: "m5", name: "Mercado São João", address: "Estrada do Passo, 900", city: "Viamão, RS", hours: "08h – 20h", distanceKm: 4.2, open: true, rating: 3.9, publishPrices: true },
];

const raw: Array<[string, string, string, Category, string, string, number]> = [
  ["Arroz 5kg", "Bom Grão", "7891234567890", "Mercearia", "5 kg", "🍚", 20.0],
  ["Feijão Preto 1kg", "Campo Sul", "7891234567891", "Mercearia", "1 kg", "🫘", 5.6],
  ["Açúcar Refinado 1kg", "Doce Vale", "7891234567892", "Mercearia", "1 kg", "🧂", 3.3],
  ["Café Torrado 500g", "Serra Alta", "7891234567893", "Mercearia", "500 g", "☕", 12.4],
  ["Leite Integral 1L", "Boa Vaca", "7891234567894", "Laticínios", "1 L", "🥛", 3.6],
  ["Óleo de Soja 900ml", "Girassol", "7891234567895", "Mercearia", "900 ml", "🛢️", 5.1],
  ["Macarrão Espaguete 500g", "Nona Rosa", "7891234567896", "Mercearia", "500 g", "🍝", 2.9],
  ["Farinha de Trigo 1kg", "Moinho Sul", "7891234567897", "Mercearia", "1 kg", "🌾", 3.4],
  ["Detergente 500ml", "Brilha+", "7891234567898", "Limpeza", "500 ml", "🧴", 1.9],
  ["Papel Higiênico 12 rolos", "Suave", "7891234567899", "Higiene", "12 un", "🧻", 16.2],
  ["Sabão em Pó 1kg", "Brilha+", "7891234567900", "Limpeza", "1 kg", "🧼", 9.1],
  ["Amaciante 2L", "Aroma Doce", "7891234567901", "Limpeza", "2 L", "🌸", 10.3],
  ["Água Sanitária 2L", "Clarex", "7891234567902", "Limpeza", "2 L", "🪣", 4.2],
  ["Refrigerante Cola 2L", "Fresk", "7891234567903", "Bebidas", "2 L", "🥤", 6.1],
  ["Suco de Uva 1L", "Pomar", "7891234567904", "Bebidas", "1 L", "🍇", 8.4],
  ["Cerveja Lata 350ml", "Colina", "7891234567905", "Bebidas", "350 ml", "🍺", 2.6],
  ["Água Mineral 1,5L", "Fonte Clara", "7891234567906", "Bebidas", "1,5 L", "💧", 1.8],
  ["Queijo Mussarela 500g", "Boa Vaca", "7891234567907", "Laticínios", "500 g", "🧀", 19.9],
  ["Manteiga 200g", "Boa Vaca", "7891234567908", "Laticínios", "200 g", "🧈", 8.9],
  ["Iogurte Natural 170g", "Vida Leve", "7891234567909", "Laticínios", "170 g", "🥣", 2.2],
  ["Requeijão 200g", "Boa Vaca", "7891234567910", "Laticínios", "200 g", "🥄", 5.4],
  ["Sabonete 90g", "Suave", "7891234567911", "Higiene", "90 g", "🧼", 1.7],
  ["Shampoo 350ml", "Suave", "7891234567912", "Higiene", "350 ml", "🧴", 10.8],
  ["Creme Dental 90g", "SorriBem", "7891234567913", "Higiene", "90 g", "🪥", 3.5],
  ["Banana Prata kg", "Hortifruti", "7891234567914", "Hortifruti", "1 kg", "🍌", 4.1],
  ["Tomate kg", "Hortifruti", "7891234567915", "Hortifruti", "1 kg", "🍅", 5.2],
  ["Batata kg", "Hortifruti", "7891234567916", "Hortifruti", "1 kg", "🥔", 3.9],
  ["Cebola kg", "Hortifruti", "7891234567917", "Hortifruti", "1 kg", "🧅", 4.4],
  ["Peito de Frango kg", "Granja Real", "7891234567918", "Carnes", "1 kg", "🍗", 12.7],
  ["Carne Moída kg", "Boi Sul", "7891234567919", "Carnes", "1 kg", "🥩", 26.4],
];

export const products: Product[] = raw.map(([name, brand, ean, category, size, emoji, cost], i) => ({
  id: `p${i + 1}`, name, brand, ean, category, size, emoji, cost,
}));

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
function rnd(seed: string) { return (hash(seed) % 10000) / 10000; }

const statusPool: Availability[] = ["available", "available", "available", "available", "low", "out", "not_carried", "stale"];

function buildOffers(): Offer[] {
  const out: Offer[] = [];
  for (const p of products) {
    const base = p.cost * 1.42;
    for (const m of [...markets, { id: MY_MARKET_ID } as Market]) {
      const r = rnd(p.id + m.id);
      const price = Math.round((base * (0.92 + r * 0.22)) * 100) / 100;
      let status: Availability = statusPool[hash(m.id + p.id) % statusPool.length]!;
      if (m.id === MY_MARKET_ID && status === "not_carried" && hash(p.id) % 2 === 0) status = "available";
      const stock = status === "out" ? 0 : status === "low" ? 2 + (hash(p.id + m.id) % 6) : status === "not_carried" ? 0 : 20 + (hash(m.id + p.id) % 130);
      out.push({
        marketId: m.id, productId: p.id, price, status, stock,
        updatedMinutesAgo: status === "stale" ? 60 * 24 * (3 + (hash(p.id) % 5)) : 8 + (hash(m.id + p.id) % 220),
      });
    }
  }
  // curated demo values for the flagship flow
  const fix = (mid: string, pid: string, price: number, status: Availability, mins: number) => {
    const o = out.find((x) => x.marketId === mid && x.productId === pid);
    if (o) { o.price = price; o.status = status; o.updatedMinutesAgo = mins; if (status !== "out" && status !== "not_carried") o.stock = 84; }
  };
  fix("m1", "p1", 27.9, "available", 12);
  fix("m2", "p1", 28.5, "available", 35);
  fix("m3", "p1", 29.9, "available", 60);
  fix("m5", "p1", 26.9, "out", 300);
  fix(MY_MARKET_ID, "p1", 29.9, "available", 30);
  fix("m1", "p2", 8.9, "available", 20); fix("m2", "p2", 9.4, "available", 40); fix("m3", "p2", 9.1, "available", 70); fix("m5", "p2", 9.9, "available", 90);
  fix("m1", "p4", 16.99, "available", 15); fix("m2", "p4", 16.99, "available", 25); fix("m3", "p4", 18.4, "available", 55); fix(MY_MARKET_ID, "p4", 18.9, "available", 45);
  fix("m1", "p5", 5.29, "available", 18); fix("m2", "p5", 5.6, "available", 33); fix("m3", "p5", 5.4, "available", 80);
  fix("m1", "p3", 4.9, "available", 22); fix("m2", "p3", 5.1, "available", 44); fix("m3", "p3", 4.99, "not_carried", 22);
  return out;
}

export const offers: Offer[] = buildOffers();

export const publicMarkets = markets;

export function productById(id: string) { return products.find((p) => p.id === id); }
export function marketById(id: string) { return markets.find((m) => m.id === id); }
export function offersForProduct(productId: string, includeMine = false) {
  return offers.filter((o) => o.productId === productId && (includeMine || o.marketId !== MY_MARKET_ID) && o.status !== "not_carried");
}
export function myOffer(productId: string) {
  return offers.find((o) => o.marketId === MY_MARKET_ID && o.productId === productId);
}
export function myCatalog() {
  return offers.filter((o) => o.marketId === MY_MARKET_ID);
}
export function isSellable(status: Availability) { return status === "available" || status === "low" || status === "stale"; }

export function priceStats(productId: string) {
  const list = offersForProduct(productId).filter((o) => isSellable(o.status));
  const prices = list.map((o) => o.price);
  const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  return {
    count: list.length,
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
    avg,
    bestOffer: list.slice().sort((a, b) => a.price - b.price)[0],
  };
}

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return products;
  return products.filter((p) =>
    (p.name + " " + p.brand + " " + p.category + " " + p.ean).toLowerCase().includes(t));
}

export interface HistoryPoint { day: string; meu: number; media: number; menor: number }
export function history(productId: string, days: 7 | 30 | 90): HistoryPoint[] {
  const s = priceStats(productId);
  const mine = myOffer(productId)?.price ?? s.avg;
  const step = days === 7 ? 1 : days === 30 ? 3 : 9;
  const pts: HistoryPoint[] = [];
  for (let d = days; d >= 0; d -= step) {
    const w = rnd(productId + d) * 0.08 - 0.04;
    const date = new Date(Date.now() - d * 86400000);
    pts.push({
      day: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      meu: Math.round(mine * (1 + w * 0.6) * 100) / 100,
      media: Math.round((s.avg || mine) * (1 + w) * 100) / 100,
      menor: Math.round((s.min || mine) * (1 + w * 1.3) * 100) / 100,
    });
  }
  return pts;
}

export function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function ago(minutes: number) {
  if (minutes < 60) return `há ${minutes} min`;
  if (minutes < 60 * 24) return `há ${Math.round(minutes / 60)} h`;
  return `há ${Math.round(minutes / 1440)} dias`;
}

export const availabilityMeta: Record<Availability, { label: string; dot: string; text: string }> = {
  available: { label: "Disponível", dot: "bg-success", text: "text-success" },
  low: { label: "Baixo estoque", dot: "bg-warning", text: "text-warning" },
  out: { label: "Sem estoque", dot: "bg-destructive", text: "text-destructive" },
  not_carried: { label: "Não comercializado", dot: "bg-muted-foreground", text: "text-muted-foreground" },
  stale: { label: "Preço desatualizado", dot: "bg-info", text: "text-info" },
};

export interface BasketRow { marketId: string; total: number; found: number; missing: string[] }
export function compareBasket(items: { productId: string; qty: number }[]): BasketRow[] {
  return markets.map((m) => {
    let total = 0; let found = 0; const missing: string[] = [];
    for (const it of items) {
      const o = offers.find((x) => x.marketId === m.id && x.productId === it.productId);
      if (o && isSellable(o.status)) { total += o.price * it.qty; found++; }
      else missing.push(productById(it.productId)?.name ?? "");
    }
    return { marketId: m.id, total: Math.round(total * 100) / 100, found, missing };
  }).sort((a, b) => b.found - a.found || a.total - b.total);
}
