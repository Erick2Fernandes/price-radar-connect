import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowDown, ArrowUp, Clock, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl, isSellable, marketById, myCatalog, offersForProduct, priceStats, productById } from "@/lib/pr/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas — PreçoRadar" },
      { name: "description", content: "Alertas de concorrência, estoque e dados desatualizados do seu mercado." },
      { property: "og:title", content: "Alertas — PreçoRadar" },
      { property: "og:description", content: "Concorrentes, estoque e qualidade dos dados." },
    ],
  }),
  component: Alertas,
});

function Alertas() {
  const mine = myCatalog();
  const price = mine
    .filter((o) => isSellable(o.status))
    .map((o) => {
      const s = priceStats(o.productId);
      const best = offersForProduct(o.productId).filter((x) => isSellable(x.status)).sort((a, b) => a.price - b.price)[0];
      return { o, s, best, diff: s.min ? ((o.price - s.min) / s.min) * 100 : 0 };
    })
    .filter((r) => r.diff > 6)
    .sort((a, b) => b.diff - a.diff)
    .slice(0, 6);

  const out = mine.filter((o) => o.status === "out").length;
  const stale = mine.filter((o) => o.status === "stale").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Alertas</h1>
        <p className="text-sm text-muted-foreground">Movimentos de concorrentes e riscos operacionais.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: PackageX, t: `${out} produtos estão sem estoque`, tone: "text-destructive" },
          { icon: Clock, t: `${stale} produtos com dados desatualizados`, tone: "text-info" },
          { icon: AlertTriangle, t: `${price.length} produtos com preço acima da média`, tone: "text-warning" },
        ].map((c) => (
          <div key={c.t} className="pr-card p-5">
            <c.icon className={cn("size-5", c.tone)} />
            <p className="mt-3 text-sm font-medium">{c.t}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {price.map(({ o, best, diff }) => {
          const p = productById(o.productId)!;
          return (
            <article key={o.productId} className="pr-card p-5">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-warning uppercase">
                <ArrowDown className="size-3.5" /> Concorrente com preço menor
              </p>
              <h2 className="mt-2 font-semibold">
                {marketById(best.marketId)?.name} está {diff.toFixed(1)}% mais barato em {p.name}.
              </h2>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <p>Seu preço: <strong>{brl(o.price)}</strong></p>
                <p>Concorrente: <strong>{brl(best.price)}</strong></p>
                <p className="inline-flex items-center gap-1 text-destructive"><ArrowUp className="size-3.5" /> Diferença: {diff.toFixed(1)}%</p>
              </div>
              <Button asChild size="sm" className="mt-4">
                <Link to="/mercado/comparar" search={{ p: p.id }}>Analisar oportunidade</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
