import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markets, offers, MY_MARKET_ID } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cliente/mercados/")({
  head: () => ({
    meta: [
      { title: "Mercados — PreçoRadar" },
      { name: "description", content: "Veja os supermercados monitorados pelo PreçoRadar, com preços e disponibilidade." },
      { property: "og:title", content: "Mercados — PreçoRadar" },
      { property: "og:description", content: "Supermercados monitorados perto de você." },
    ],
  }),
  component: Mercados,
});

function Mercados() {
  const { favMarkets, toggleFavMarket } = usePR();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mercados</h1>
        <p className="text-sm text-muted-foreground">Preços publicados pelos mercados participantes — dados demonstrativos.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {markets.map((m) => {
          const count = offers.filter((o) => o.marketId === m.id && o.marketId !== MY_MARKET_ID && o.status !== "not_carried").length;
          return (
            <div key={m.id} className="pr-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">🏪 {m.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.address}</p>
                </div>
                <button onClick={() => toggleFavMarket(m.id)} aria-label="Favoritar mercado">
                  <Heart className={cn("size-5", favMarkets.includes(m.id) ? "fill-destructive text-destructive" : "text-muted-foreground")} />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {m.distanceKm} km</span>
                <span className={m.open ? "text-success" : "text-destructive"}>{m.open ? "🟢 Aberto" : "🔴 Fechado"}</span>
                <span className="inline-flex items-center gap-1"><Star className="size-3.5 text-warning" /> {m.rating}</span>
                <span>{count} produtos monitorados</span>
              </div>
              <Button asChild size="sm" className="mt-4">
                <Link to="/cliente/mercados/$marketId" params={{ marketId: m.id }}>Ver preços</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
