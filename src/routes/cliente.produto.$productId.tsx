import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Heart, Plus } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OfferCard } from "@/components/pr/OfferCard";
import { Stat } from "@/components/pr/Stat";
import { brl, history, offersForProduct, priceStats, productById } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cliente/produto/$productId")({
  loader: ({ params }) => {
    const p = productById(params.productId);
    if (!p) throw notFound();
    return { name: p.name, brand: p.brand };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — PreçoRadar` : "Produto — PreçoRadar" },
      { name: "description", content: loaderData ? `Compare preços de ${loaderData.name} (${loaderData.brand}) entre supermercados e veja o histórico.` : "Detalhes do produto no PreçoRadar." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — PreçoRadar` : "Produto — PreçoRadar" },
      { property: "og:description", content: "Preço atual, histórico e disponibilidade por mercado." },
    ],
  }),
  errorComponent: ({ error }) => <div className="pr-card p-8 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="pr-card p-8 text-center">Produto não encontrado.</div>,
  component: ProdutoDetalhe,
});

function ProdutoDetalhe() {
  const { productId } = Route.useParams();
  const product = productById(productId)!;
  const stats = priceStats(productId);
  const offers = offersForProduct(productId).slice().sort((a, b) => a.price - b.price);
  const { addToList, toggleFavProduct, favProducts, addAlert, alerts, removeAlert } = usePR();
  const [period, setPeriod] = useState<7 | 30>(7);
  const [target, setTarget] = useState(String((stats.min * 0.94).toFixed(2)));
  const alert = alerts.find((a) => a.productId === productId);
  const data = history(productId, period);

  return (
    <div className="space-y-6">
      <header className="pr-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-accent text-5xl">{product.emoji}</div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.brand} · {product.category} · {product.size}</p>
          <p className="mt-1 text-xs text-muted-foreground">EAN {product.ean}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { addToList(productId); toast.success("Adicionado à sua lista"); }}>
            <Plus className="size-4" /> Adicionar à minha lista
          </Button>
          <Button variant="outline" onClick={() => toggleFavProduct(productId)}>
            <Heart className={cn("size-4", favProducts.includes(productId) && "fill-destructive text-destructive")} /> Favoritar
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Menor preço disponível" value={brl(stats.min)} tone="success" />
        <Stat label="Preço médio" value={brl(stats.avg)} />
        <Stat label="Maior preço" value={brl(stats.max)} tone="destructive" />
      </div>

      <section className="pr-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Histórico de preço</h2>
          <div className="flex gap-1">
            {([7, 30] as const).map((d) => (
              <button key={d} onClick={() => setPeriod(d)}
                className={cn("rounded-md px-3 py-1 text-xs font-medium", period === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary")}>
                {d} dias
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Line type="monotone" dataKey="media" name="Média" stroke="var(--color-info)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="menor" name="Menor disponível" stroke="var(--color-success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="pr-card p-6">
        <h2 className="font-bold">Alerta de preço</h2>
        {alert ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-success/12 px-3 py-1.5 text-sm font-medium text-success">
              <Bell className="size-4" /> Alerta ativo em {brl(alert.target)}
            </span>
            <p className="text-sm text-muted-foreground">Vamos avisar quando encontrarmos esse preço ou um valor menor.</p>
            <Button variant="ghost" size="sm" onClick={() => removeAlert(productId)}>Remover</Button>
          </div>
        ) : (
          <form
            className="mt-3 flex flex-wrap items-end gap-3"
            onSubmit={(e) => { e.preventDefault(); addAlert(productId, Number(target)); toast.success("Alerta criado!"); }}
          >
            <div>
              <p className="text-xs text-muted-foreground">Preço atual: {brl(stats.min)}</p>
              <label className="text-sm font-medium" htmlFor="alvo">Avise-me quando chegar a:</label>
              <Input id="alvo" value={target} onChange={(e) => setTarget(e.target.value)} className="mt-1 w-36" inputMode="decimal" />
            </div>
            <Button type="submit"><Bell className="size-4" /> Criar alerta</Button>
          </form>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">Mercados que vendem</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((o) => <OfferCard key={o.marketId} offer={o} best={stats.bestOffer?.marketId === o.marketId} />)}
        </div>
      </section>
    </div>
  );
}
