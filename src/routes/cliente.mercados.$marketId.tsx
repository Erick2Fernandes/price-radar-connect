import { createFileRoute, notFound } from "@tanstack/react-router";
import { Clock, Flame, MapPin, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/pr/StatusDot";
import { ago, brl, isSellable, marketById, offers, priceStats, productById } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { toast } from "sonner";

export const Route = createFileRoute("/cliente/mercados/$marketId")({
  loader: ({ params }) => {
    const m = marketById(params.marketId);
    if (!m) throw notFound();
    return { name: m.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — PreçoRadar` : "Mercado — PreçoRadar" },
      { name: "description", content: loaderData ? `Preços monitorados, ofertas e disponibilidade no ${loaderData.name}.` : "Perfil do mercado." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — PreçoRadar` : "Mercado — PreçoRadar" },
      { property: "og:description", content: "Preços monitorados e ofertas em destaque." },
    ],
  }),
  notFoundComponent: () => <div className="pr-card p-8 text-center">Mercado não encontrado.</div>,
  component: PerfilMercado,
});

function PerfilMercado() {
  const { marketId } = Route.useParams();
  const market = marketById(marketId)!;
  const { addToList } = usePR();
  const list = offers.filter((o) => o.marketId === marketId && o.status !== "not_carried");
  const deals = list
    .filter((o) => isSellable(o.status) && o.price <= priceStats(o.productId).min * 1.001)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <header className="pr-card p-6">
        <h1 className="text-2xl font-bold">🏪 {market.name}</h1>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span>{market.address} · {market.city}</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {market.hours}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {market.distanceKm} km</span>
          <span className="inline-flex items-center gap-1"><Star className="size-3.5 text-warning" /> {market.rating}</span>
        </div>
        <Button
          className="mt-4"
          onClick={() => { deals.forEach((d) => addToList(d.productId)); toast.success("Produtos adicionados à sua lista"); }}
        >
          <Plus className="size-4" /> Adicionar produtos à minha lista
        </Button>
      </header>

      <section>
        <h2 className="mb-3 font-bold">Ofertas e destaques</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((o) => {
            const p = productById(o.productId)!;
            return (
              <div key={o.productId} className="pr-card p-4">
                <p className="inline-flex items-center gap-1 text-xs font-semibold text-destructive"><Flame className="size-3.5" /> Oferta</p>
                <p className="mt-1 truncate text-sm font-medium">{p.emoji} {p.name}</p>
                <p className="font-display mt-1 text-xl font-bold">{brl(o.price)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pr-card overflow-x-auto">
        <div className="p-4 pb-0"><h2 className="font-bold">Preços monitorados</h2></div>
        <table className="mt-3 w-full min-w-[620px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3 font-medium">Produto</th>
              <th className="p-3 font-medium">Preço</th>
              <th className="p-3 font-medium">Disponibilidade</th>
              <th className="p-3 font-medium">Atualizado</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.slice(0, 20).map((o) => {
              const p = productById(o.productId)!;
              return (
                <tr key={o.productId}>
                  <td className="p-3 font-medium">{p.emoji} {p.name}</td>
                  <td className="p-3">{brl(o.price)}</td>
                  <td className="p-3"><StatusDot status={o.status} /></td>
                  <td className="p-3 text-muted-foreground">{ago(o.updatedMinutesAgo)}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { addToList(p.id); toast.success("Adicionado à lista"); }}>
                      <Plus className="size-3.5" /> Lista
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
