import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compareBasket, markets, offers } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cliente/proximos")({
  head: () => ({
    meta: [
      { title: "Mercados próximos — PreçoRadar" },
      { name: "description", content: "Supermercados perto de você em Viamão, RS, com distância, status e preços monitorados." },
      { property: "og:title", content: "Mercados próximos — PreçoRadar" },
      { property: "og:description", content: "Encontre supermercados perto de você." },
    ],
  }),
  component: Proximos,
});

function Proximos() {
  const { list } = usePR();
  const best = compareBasket(list)[0];
  const sorted = [...markets].sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mercados próximos</h1>
        <p className="text-sm text-muted-foreground">📍 Localização simulada: Viamão, RS</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((m) => {
          const count = offers.filter((o) => o.marketId === m.id && o.status !== "not_carried").length;
          const isBest = m.id === best?.marketId;
          return (
            <div key={m.id} className={cn("pr-card p-5", isBest && "ring-2 ring-primary")}>
              <p className="font-semibold">🏪 {m.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{m.address}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="size-3.5" /> {m.distanceKm} km</p>
                <p className={m.open ? "text-success" : "text-destructive"}>{m.open ? "🟢 Aberto" : "🔴 Fechado"}</p>
                <p className="text-muted-foreground">{count} produtos monitorados</p>
                <p className="inline-flex items-center gap-1 text-muted-foreground"><Star className="size-3.5 text-warning" /> {m.rating}</p>
              </div>
              {isBest && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground uppercase">
                  <Trophy className="size-3" /> Melhor preço da sua lista
                </p>
              )}
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
