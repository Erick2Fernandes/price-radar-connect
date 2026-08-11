import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brl, compareBasket, isSellable, marketById, offers, priceStats, productById } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cliente/lista")({
  head: () => ({
    meta: [
      { title: "Minha lista — PreçoRadar" },
      { name: "description", content: "Monte sua lista de compras e descubra em qual supermercado ela fica mais barata." },
      { property: "og:title", content: "Minha lista — PreçoRadar" },
      { property: "og:description", content: "Descubra onde sua lista fica mais barata." },
    ],
  }),
  component: MinhaLista,
});

function MinhaLista() {
  const { list, setQty, removeFromList } = usePR();
  const rows = compareBasket(list);
  const full = rows.filter((r) => r.found === list.length);
  const best = full[0] ?? rows[0];
  const worst = full.length > 1 ? full[full.length - 1] : rows[rows.length - 1];
  const savings = worst && best ? Math.max(0, worst.total - best.total) : 0;

  if (list.length === 0) {
    return (
      <div className="pr-card p-10 text-center">
        <h1 className="text-xl font-bold">Sua lista está vazia</h1>
        <p className="mt-1 text-sm text-muted-foreground">Adicione produtos pela busca para comparar mercados.</p>
        <Button asChild className="mt-4"><Link to="/cliente/buscar" search={{ q: "Arroz" }}>Buscar produtos</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Minha lista</h1>
        <p className="text-sm text-muted-foreground">{list.length} produtos · melhor preço encontrado por item</p>
      </header>

      <section className="pr-card divide-y divide-border">
        {list.map((item) => {
          const p = productById(item.productId)!;
          const s = priceStats(item.productId);
          return (
            <div key={item.productId} className="flex flex-wrap items-center gap-4 p-4">
              <span className="text-2xl">{p.emoji}</span>
              <div className="min-w-0 flex-1">
                <Link to="/cliente/produto/$productId" params={{ productId: p.id }} className="block truncate font-medium hover:underline">
                  {p.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  Melhor preço: <span className="font-semibold text-success">{brl(s.min)}</span> em {marketById(s.bestOffer?.marketId ?? "m1")?.name}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="size-8" onClick={() => setQty(p.id, item.qty - 1)} aria-label="Diminuir"><Minus className="size-3.5" /></Button>
                <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                <Button variant="outline" size="icon" className="size-8" onClick={() => setQty(p.id, item.qty + 1)} aria-label="Aumentar"><Plus className="size-3.5" /></Button>
              </div>
              <Button variant="ghost" size="icon" className="size-8" onClick={() => removeFromList(p.id)} aria-label="Remover">
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="text-xl font-bold">Descubra onde sua lista fica mais barata.</h2>
        <p className="text-sm text-muted-foreground">
          Consideramos custo total <strong>e</strong> cobertura da lista — um mercado com menos produtos não é eleito o melhor.
        </p>

        {savings > 0 && (
          <div className="mt-4 rounded-xl border border-success/30 bg-success/10 p-4">
            <p className="font-display text-lg font-bold text-success">💰 Você economiza {brl(savings)}</p>
            <p className="text-sm text-muted-foreground">comparando com a opção mais cara disponível com cobertura total.</p>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const m = marketById(r.marketId)!;
            const isBest = r.marketId === best?.marketId;
            return (
              <div key={r.marketId} className={cn("pr-card p-5", isBest && "ring-2 ring-primary")}>
                {isBest && (
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase text-primary-foreground">
                    <Trophy className="size-3" /> Melhor combinação
                  </span>
                )}
                <p className="font-semibold">🏪 {m.name}</p>
                <p className="font-display mt-2 text-2xl font-bold">{brl(r.total)}</p>
                <p className={cn("mt-1 text-sm font-medium", r.found === list.length ? "text-success" : "text-warning")}>
                  {r.found} de {list.length} produtos encontrados
                </p>
                <p className="mt-1 text-xs text-muted-foreground">📍 {m.distanceKm} km · {m.open ? "Aberto" : "Fechado"}</p>
                {r.missing.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">Sem: {r.missing.join(", ")}</p>
                )}
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/cliente/mercados/$marketId" params={{ marketId: m.id }}>Ver lista</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pr-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Produto</th>
              {rows.map((r) => <th key={r.marketId} className="p-3 font-medium">{marketById(r.marketId)?.name}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((item) => (
              <tr key={item.productId}>
                <td className="p-3 font-medium">{productById(item.productId)?.name} ×{item.qty}</td>
                {rows.map((r) => {
                  const o = offers.find((x) => x.marketId === r.marketId && x.productId === item.productId);
                  const ok = o && isSellable(o.status);
                  return <td key={r.marketId} className={cn("p-3", ok ? "" : "text-muted-foreground")}>{ok ? brl(o!.price * item.qty) : "—"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
