import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/components/pr/OfferCard";
import { brl, isSellable, markets, offersForProduct, priceStats, searchProducts } from "@/lib/pr/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cliente/buscar")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Buscar produtos — PreçoRadar" },
      { name: "description", content: "Compare o preço de um produto em vários supermercados, com disponibilidade e distância." },
      { property: "og:title", content: "Buscar produtos — PreçoRadar" },
      { property: "og:description", content: "Compare preços e disponibilidade entre mercados." },
    ],
  }),
  component: Buscar,
});

type Sort = "cheap" | "near" | "mix" | "avail" | "fresh";
const sorts: { id: Sort; label: string }[] = [
  { id: "cheap", label: "Mais barato" },
  { id: "near", label: "Mais próximo" },
  { id: "mix", label: "Melhor preço/distância" },
  { id: "avail", label: "Disponível agora" },
  { id: "fresh", label: "Atualizado recentemente" },
];

function Buscar() {
  const { q } = Route.useSearch();
  const [sort, setSort] = useState<Sort>("cheap");
  const results = useMemo(() => searchProducts(q), [q]);
  const product = results[0];

  const offers = useMemo(() => {
    if (!product) return [];
    const list = offersForProduct(product.id);
    const dist = (id: string) => markets.find((m) => m.id === id)?.distanceKm ?? 99;
    const sorted = [...list];
    if (sort === "cheap") sorted.sort((a, b) => a.price - b.price);
    if (sort === "near") sorted.sort((a, b) => dist(a.marketId) - dist(b.marketId));
    if (sort === "mix") sorted.sort((a, b) => a.price + dist(a.marketId) * 0.9 - (b.price + dist(b.marketId) * 0.9));
    if (sort === "avail") sorted.sort((a, b) => Number(isSellable(b.status)) - Number(isSellable(a.status)) || a.price - b.price);
    if (sort === "fresh") sorted.sort((a, b) => a.updatedMinutesAgo - b.updatedMinutesAgo);
    return sorted;
  }, [product, sort]);

  const stats = product ? priceStats(product.id) : null;

  if (!q) {
    return (
      <div className="pr-card p-10 text-center">
        <Search className="mx-auto size-6 text-muted-foreground" />
        <h1 className="mt-3 text-xl font-bold">Busque um produto</h1>
        <p className="mt-1 text-sm text-muted-foreground">Use a barra de pesquisa acima. Ex.: "Arroz 5kg".</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pr-card p-10 text-center">
        <h1 className="text-xl font-bold">Nada encontrado para "{q}"</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tente outro termo, como arroz, café ou leite.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-muted-foreground">
          Encontramos {offers.length} mercados com este produto · menor preço disponível {brl(stats?.min ?? 0)}
        </p>
        <Button asChild variant="link" className="h-auto p-0 text-sm">
          <Link to="/cliente/produto/$productId" params={{ productId: product.id }}>Ver detalhes e histórico →</Link>
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        {sorts.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              sort === s.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <OfferCard key={o.marketId} offer={o} best={stats?.bestOffer?.marketId === o.marketId} />
        ))}
      </div>

      {results.length > 1 && (
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground">Outros resultados</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(1, 10).map((p) => (
              <Link key={p.id} to="/cliente/produto/$productId" params={{ productId: p.id }} className="pr-card flex items-center gap-3 p-4 hover:shadow-lift">
                <span className="text-2xl">{p.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.brand} · a partir de {brl(priceStats(p.id).min)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
