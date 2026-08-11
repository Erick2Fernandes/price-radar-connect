import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl, isSellable, myCatalog, priceStats, productById } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado/oportunidades")({
  head: () => ({
    meta: [
      { title: "Oportunidades — PreçoRadar" },
      { name: "description", content: "Recomendações de preço priorizando competitividade e margem mínima." },
      { property: "og:title", content: "Oportunidades — PreçoRadar" },
      { property: "og:description", content: "Recomendações de preço com controle de margem." },
    ],
  }),
  component: OportunidadesMercado,
});

function OportunidadesMercado() {
  const { minMargin } = usePR();
  const rows = myCatalog()
    .filter((o) => isSellable(o.status))
    .map((o) => {
      const s = priceStats(o.productId);
      const rec = Math.round(Math.max(s.min + 0.5, s.avg * 1.02) * 100) / 100;
      const p = productById(o.productId)!;
      return { o, s, rec, p, gap: s.avg ? ((o.price - s.avg) / s.avg) * 100 : 0, recMargin: ((rec - p.cost) / rec) * 100 };
    })
    .filter((r) => r.gap > 3)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">Priorizamos margem e rentabilidade — não simplesmente o menor preço.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {rows.map((r) => {
          const high = r.gap > 6;
          return (
            <article key={r.o.productId} className="pr-card p-5">
              <p className={cn("inline-flex items-center gap-1.5 text-xs font-bold uppercase", high ? "text-destructive" : "text-warning")}>
                <Flame className="size-3.5" /> Impacto {high ? "alto" : "médio"}
              </p>
              <h2 className="mt-2 font-semibold">Revisar preço do {r.p.name}</h2>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-muted-foreground">Seu preço</dt><dd className="font-semibold">{brl(r.o.price)}</dd></div>
                <div><dt className="text-muted-foreground">Média</dt><dd className="font-semibold">{brl(r.s.avg)}</dd></div>
                <div><dt className="text-muted-foreground">Menor disponível</dt><dd className="font-semibold text-success">{brl(r.s.min)}</dd></div>
                <div><dt className="text-muted-foreground">Preço recomendado</dt><dd className="font-semibold text-info">{brl(r.rec)}</dd></div>
              </dl>
              <p className={cn("mt-3 text-sm font-medium", r.recMargin >= minMargin ? "text-success" : "text-destructive")}>
                Margem estimada {r.recMargin.toFixed(1)}% {r.recMargin >= minMargin ? "· dentro da margem mínima" : "· 🔴 abaixo da margem mínima"}
              </p>
              <Button asChild size="sm" className="mt-4">
                <Link to="/mercado/comparar" search={{ p: r.p.id }}>Analisar</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
