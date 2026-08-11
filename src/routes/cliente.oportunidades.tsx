import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Flame, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl, marketById, priceStats, productById, products } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";

export const Route = createFileRoute("/cliente/oportunidades")({
  head: () => ({
    meta: [
      { title: "Economize mais — PreçoRadar" },
      { name: "description", content: "Oportunidades de economia detectadas nos supermercados monitorados perto de você." },
      { property: "og:title", content: "Economize mais — PreçoRadar" },
      { property: "og:description", content: "Oportunidades de economia detectadas para você." },
    ],
  }),
  component: Oportunidades,
});

function Oportunidades() {
  const { favProducts, alerts } = usePR();
  const pool = [...new Set([...favProducts, "p1", "p4", "p5", "p2"])].slice(0, 6);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Economize mais</h1>
        <p className="text-sm text-muted-foreground">Oportunidades detectadas com base nos preços monitorados.</p>
      </header>

      {alerts.length > 0 && (
        <section className="pr-card border-success/40 bg-success/8 p-5">
          <h2 className="inline-flex items-center gap-2 font-bold text-success"><Bell className="size-4" /> Notificações</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {alerts.map((a) => (
              <li key={a.productId}>
                O {productById(a.productId)?.name} está sendo acompanhado — avisaremos ao atingir {brl(a.target)}.
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {pool.map((pid) => {
          const p = productById(pid)!;
          const s = priceStats(pid);
          const drop = s.avg - s.min;
          const pct = s.avg ? (drop / s.avg) * 100 : 0;
          return (
            <article key={pid} className="pr-card p-5">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive uppercase"><Flame className="size-3.5" /> Oportunidade</p>
              <h3 className="mt-2 font-semibold">
                {p.name} está {pct.toFixed(0)}% mais barato no {marketById(s.bestOffer?.marketId ?? "m1")?.name}.
              </h3>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-success">
                <TrendingDown className="size-4" /> Você economiza {brl(drop)} · de {brl(s.avg)} por {brl(s.min)}
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link to="/cliente/produto/$productId" params={{ productId: pid }}>Ver oferta</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
