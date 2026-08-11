import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl, marketById, priceStats, productById } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";

export const Route = createFileRoute("/cliente/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — PreçoRadar" },
      { name: "description", content: "Seus produtos e supermercados favoritos, com preços acompanhados." },
      { property: "og:title", content: "Favoritos — PreçoRadar" },
      { property: "og:description", content: "Produtos e mercados que você acompanha." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { favProducts, favMarkets, toggleFavProduct, toggleFavMarket } = usePR();
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Favoritos</h1>
        <p className="text-sm text-muted-foreground">Acompanhe produtos e mercados que importam para você.</p>
      </header>

      <section>
        <h2 className="mb-3 font-bold">Produtos favoritos</h2>
        {favProducts.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum produto favoritado.</p> : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favProducts.map((id) => {
              const p = productById(id)!;
              const s = priceStats(id);
              return (
                <div key={id} className="pr-card flex items-center gap-3 p-4">
                  <span className="text-2xl">{p.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <Link to="/cliente/produto/$productId" params={{ productId: id }} className="block truncate text-sm font-medium hover:underline">{p.name}</Link>
                    <p className="text-xs text-muted-foreground">A partir de {brl(s.min)}</p>
                  </div>
                  <button onClick={() => toggleFavProduct(id)} aria-label="Remover favorito"><Heart className="size-4 fill-destructive text-destructive" /></button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">Mercados favoritos</h2>
        {favMarkets.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum mercado favoritado.</p> : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favMarkets.map((id) => {
              const m = marketById(id)!;
              return (
                <div key={id} className="pr-card p-4">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">🏪 {m.name}</p>
                    <button onClick={() => toggleFavMarket(id)} aria-label="Remover favorito"><Heart className="size-4 fill-destructive text-destructive" /></button>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">📍 {m.distanceKm} km · {m.open ? "Aberto" : "Fechado"}</p>
                  <Button asChild size="sm" variant="outline" className="mt-3">
                    <Link to="/cliente/mercados/$marketId" params={{ marketId: id }}>Ver preços</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
