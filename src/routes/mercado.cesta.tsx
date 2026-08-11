import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Stat } from "@/components/pr/Stat";
import { Checkbox } from "@/components/ui/checkbox";
import { brl, isSellable, myOffer, priceStats, products } from "@/lib/pr/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado/cesta")({
  head: () => ({
    meta: [
      { title: "Cesta estratégica — PreçoRadar" },
      { name: "description", content: "Monte a cesta de produtos-chave e acompanhe seu índice de competitividade." },
      { property: "og:title", content: "Cesta estratégica — PreçoRadar" },
      { property: "og:description", content: "Índice de competitividade da sua cesta." },
    ],
  }),
  component: Cesta,
});

const defaults = ["p1", "p2", "p3", "p4", "p5", "p6"];

function Cesta() {
  const [sel, setSel] = useState<string[]>(defaults);
  const rows = sel.map((id) => ({ id, mine: myOffer(id), stats: priceStats(id) })).filter((r) => r.mine && isSellable(r.mine.status));
  const total = rows.reduce((a, r) => a + (r.mine?.price ?? 0), 0);
  const media = rows.reduce((a, r) => a + r.stats.avg, 0);
  const diff = media ? ((total - media) / media) * 100 : 0;
  const index = Math.max(0, Math.min(100, Math.round(100 - diff * 3)));
  const status = index >= 90 ? "MUITO COMPETITIVO" : index >= 75 ? "COMPETITIVO" : "ATENÇÃO";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Cesta estratégica</h1>
        <p className="text-sm text-muted-foreground">Selecione os produtos que mais influenciam a percepção de preço.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Minha cesta" value={brl(total)} />
        <Stat label="Média do mercado" value={brl(media)} tone="info" />
        <Stat label="Diferença" value={`${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`} tone={diff <= 0 ? "success" : "destructive"} />
        <Stat label="Índice" value={`${index}/100`} tone={index >= 90 ? "success" : index >= 75 ? "warning" : "destructive"} hint={status} />
      </div>

      <section className="pr-card p-6">
        <h2 className="font-bold">Produtos da cesta</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 15).map((p) => {
            const checked = sel.includes(p.id);
            return (
              <label key={p.id} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm", checked ? "border-primary bg-accent/40" : "border-border")}>
                <Checkbox checked={checked} onCheckedChange={() => setSel((s) => checked ? s.filter((x) => x !== p.id) : [...s, p.id])} />
                <span className="truncate">{p.emoji} {p.name}</span>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
}
