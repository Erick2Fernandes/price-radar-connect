import { createFileRoute, Link } from "@tanstack/react-router";
import { Stat } from "@/components/pr/Stat";
import { Button } from "@/components/ui/button";
import { ago, isSellable, markets, myOffer, offers, priceStats } from "@/lib/pr/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado/concorrentes")({
  head: () => ({
    meta: [
      { title: "Concorrentes — PreçoRadar" },
      { name: "description", content: "Mercados monitorados, cobertura de produtos e posição competitiva — dados demonstrativos." },
      { property: "og:title", content: "Concorrentes — PreçoRadar" },
      { property: "og:description", content: "Mercados monitorados e posição competitiva." },
    ],
  }),
  component: Concorrentes,
});

function Concorrentes() {
  const rows = markets.map((m) => {
    const list = offers.filter((o) => o.marketId === m.id && isSellable(o.status));
    let cheaper = 0;
    for (const o of list) {
      const mine = myOffer(o.productId);
      if (mine && isSellable(mine.status) && o.price < mine.price) cheaper++;
    }
    const fresh = Math.min(...list.map((o) => o.updatedMinutesAgo));
    return { m, count: list.length, cheaper, fresh, share: list.length ? (cheaper / list.length) * 100 : 0 };
  });

  const total = offers.filter((o) => isSellable(o.status)).length;
  const avgQuality = 87;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mercados monitorados</h1>
        <p className="text-sm text-muted-foreground">Dados demonstrativos — não representam preços reais praticados.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Mercados monitorados" value={markets.length} />
        <Stat label="Ofertas rastreadas" value={total} />
        <Stat label="Qualidade dos dados" value={`${avgQuality}%`} tone="success" hint="Cobertura da minha cesta" />
      </div>

      <div className="pr-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
            <tr>{["Mercado", "Produtos", "Última atualização", "Mais barato que eu", "Posição competitiva"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.m.id}>
                <td className="p-3 font-medium">🏪 {r.m.name}</td>
                <td className="p-3">{r.count}</td>
                <td className="p-3 text-muted-foreground">{ago(r.fresh)}</td>
                <td className="p-3">{r.cheaper} itens</td>
                <td className={cn("p-3 font-medium", r.share > 50 ? "text-destructive" : "text-success")}>
                  {r.share > 50 ? "Mais agressivo" : "Menos agressivo"} ({r.share.toFixed(0)}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="pr-card p-6">
        <h2 className="font-bold">Qualidade dos dados</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Stat label="Cobertura" value="87%" tone="success" />
          <Stat label="Atualizados hoje" value="82%" tone="success" />
          <Stat label="2–7 dias" value="12%" tone="warning" />
          <Stat label="Sem dados" value="6%" tone="destructive" />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>🟢 Atualizado</span><span>🟡 Desatualizado</span><span>🔴 Sem dados</span>
        </div>
        <Button asChild className="mt-5" variant="outline"><Link to="/mercado/comparar" search={{ p: "p1" }}>Comparar produto</Link></Button>
        <p className="mt-3 text-xs text-muted-foreground">Menor preço médio disponível considerado: {priceStats("p1").min.toFixed(2)} (Arroz 5kg).</p>
      </section>
    </div>
  );
}
