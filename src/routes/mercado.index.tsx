import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, PackageX, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Stat } from "@/components/pr/Stat";
import { Button } from "@/components/ui/button";
import { brl, myCatalog, priceStats, productById, isSellable } from "@/lib/pr/data";

export const Route = createFileRoute("/mercado/")({
  head: () => ({
    meta: [
      { title: "Dashboard do mercado — PreçoRadar" },
      { name: "description", content: "Acompanhe cobertura de dados, posição competitiva e alertas do seu supermercado." },
      { property: "og:title", content: "Dashboard do mercado — PreçoRadar" },
      { property: "og:description", content: "Como estou posicionado no mercado?" },
    ],
  }),
  component: DashboardMercado,
});

function DashboardMercado() {
  const mine = myCatalog();
  const monitorados = 128;
  const acima = mine.filter((o) => isSellable(o.status) && o.price > priceStats(o.productId).avg).length;
  const abaixo = mine.filter((o) => isSellable(o.status) && o.price < priceStats(o.productId).avg).length;
  const semEstoque = mine.filter((o) => o.status === "out").length;
  const desatualizados = mine.filter((o) => o.status === "stale").length;

  const chart = mine.slice(0, 8).map((o) => {
    const p = productById(o.productId)!;
    const s = priceStats(o.productId);
    return { nome: p.name.split(" ")[0], meu: o.price, media: Number(s.avg.toFixed(2)), menor: s.min };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Como estou posicionado no mercado?</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Produtos monitorados" value={monitorados} />
        <Stat label="Preços atualizados" value={105} hint="82% hoje" />
        <Stat label="Acima da média" value={acima || 12} tone="destructive" icon={<TrendingUp className="size-4 text-destructive" />} />
        <Stat label="Abaixo da média" value={abaixo || 24} tone="success" icon={<TrendingDown className="size-4 text-success" />} />
        <Stat label="Sem estoque" value={semEstoque || 8} tone="warning" icon={<PackageX className="size-4 text-warning" />} />
        <Stat label="Sem dados" value={11} tone="info" />
      </div>

      <section className="pr-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold">Competitividade da minha cesta</h2>
            <p className="text-sm text-muted-foreground">Meu preço × média dos concorrentes × menor preço disponível</p>
          </div>
          <span className="rounded-full bg-success/12 px-3 py-1 text-sm font-semibold text-success">Cobertura 87%</span>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="nome" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Legend />
              <Bar dataKey="meu" name="Meu preço" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="media" name="Média" fill="var(--color-info)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="menor" name="Menor disponível" fill="var(--color-success)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="pr-card p-5">
          <AlertTriangle className="size-5 text-warning" />
          <h3 className="mt-3 font-bold">{acima || 12} produtos acima da média</h3>
          <p className="mt-1 text-sm text-muted-foreground">Revise preços para melhorar competitividade sem perder margem.</p>
          <Button asChild size="sm" className="mt-4"><Link to="/mercado/comparar">Comparar agora</Link></Button>
        </div>
        <div className="pr-card p-5">
          <Bell className="size-5 text-info" />
          <h3 className="mt-3 font-bold">Alertas recentes</h3>
          <p className="mt-1 text-sm text-muted-foreground">Concorrentes ajustaram preços em itens da sua cesta.</p>
          <Button asChild size="sm" variant="outline" className="mt-4"><Link to="/mercado/alertas">Ver alertas</Link></Button>
        </div>
        <div className="pr-card p-5">
          <PackageX className="size-5 text-destructive" />
          <h3 className="mt-3 font-bold">{desatualizados || 12} com dados desatualizados</h3>
          <p className="mt-1 text-sm text-muted-foreground">Importe sua planilha para atualizar em segundos.</p>
          <Button asChild size="sm" variant="outline" className="mt-4"><Link to="/mercado/importar">Importar preços</Link></Button>
        </div>
      </section>
    </div>
  );
}
