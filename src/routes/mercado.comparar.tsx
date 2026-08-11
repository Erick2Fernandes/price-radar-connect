import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/pr/StatusDot";
import { Stat } from "@/components/pr/Stat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ago, brl, history, isSellable, marketById, myOffer, offersForProduct, priceStats, productById, products } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mercado/comparar")({
  validateSearch: (s: Record<string, unknown>) => ({ p: typeof s["p"] === "string" ? (s["p"] as string) : "p1" }),
  head: () => ({
    meta: [
      { title: "Comparar mercado — PreçoRadar" },
      { name: "description", content: "Compare seu preço com os concorrentes considerando disponibilidade, atualização e margem." },
      { property: "og:title", content: "Comparar mercado — PreçoRadar" },
      { property: "og:description", content: "Minha posição competitiva por produto." },
    ],
  }),
  component: Comparar,
});

function Comparar() {
  const { p } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { minMargin } = usePR();
  const [period, setPeriod] = useState<7 | 30 | 90>(7);
  const [analysis, setAnalysis] = useState(false);
  const [applied, setApplied] = useState(false);

  const product = (productById(p) ?? products[0])!;
  const mine = myOffer(product.id)!;
  const stats = priceStats(product.id);
  const competitors = offersForProduct(product.id);
  const variation = stats.avg ? ((mine.price - stats.avg) / stats.avg) * 100 : 0;
  const recommended = Math.round(Math.max(stats.min + 0.5, stats.avg * 1.02) * 100) / 100;
  const margin = ((mine.price - product.cost) / mine.price) * 100;
  const recMargin = ((recommended - product.cost) / recommended) * 100;
  const belowMin = recMargin < minMargin;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Comparar mercado</h1>
          <p className="text-sm text-muted-foreground">Preço, disponibilidade e data da atualização — nunca apenas preço.</p>
        </div>
        <Select value={product.id} onValueChange={(v) => navigate({ search: { p: v } })}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            {products.map((pr) => <SelectItem key={pr.id} value={pr.id}>{pr.emoji} {pr.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Meu preço" value={brl(applied ? recommended : mine.price)} />
        <Stat label="Média dos concorrentes" value={brl(stats.avg)} tone="info" />
        <Stat label="Menor preço disponível" value={brl(stats.min)} tone="success" />
        <Stat
          label="Minha posição"
          value={`${variation > 0 ? "+" : ""}${variation.toFixed(1)}%`}
          tone={variation > 0 ? "destructive" : "success"}
          hint={variation > 0 ? "acima da média" : "abaixo da média"}
        />
      </div>

      <section className="pr-card overflow-x-auto">
        <div className="p-4 pb-0"><h2 className="font-bold">{product.name} · EAN {product.ean}</h2></div>
        <table className="mt-3 w-full min-w-[620px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
            <tr>{["Mercado", "Preço", "Disponibilidade", "Atualizado"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-accent/40 font-medium">
              <td className="p-3">Meu mercado</td>
              <td className="p-3">{brl(applied ? recommended : mine.price)}</td>
              <td className="p-3"><StatusDot status={mine.status} /></td>
              <td className="p-3 text-muted-foreground">{ago(mine.updatedMinutesAgo)}</td>
            </tr>
            {competitors.map((o) => (
              <tr key={o.marketId}>
                <td className="p-3">{marketById(o.marketId)?.name}</td>
                <td className={cn("p-3", !isSellable(o.status) && "text-muted-foreground line-through")}>{brl(o.price)}</td>
                <td className="p-3"><StatusDot status={o.status} /></td>
                <td className="p-3 text-muted-foreground">{ago(o.updatedMinutesAgo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="p-4 text-xs text-muted-foreground">
          Menor preço <strong>disponível</strong>: {brl(stats.min)} — preços de itens indisponíveis são ignorados no cálculo.
        </p>
      </section>

      <section className="pr-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Histórico</h2>
          <div className="flex gap-1">
            {([7, 30, 90] as const).map((d) => (
              <button key={d} onClick={() => setPeriod(d)}
                className={cn("rounded-md px-3 py-1 text-xs font-medium", period === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary")}>
                {d} dias
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history(product.id, period)} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Legend />
              <Line type="monotone" dataKey="meu" name="Meu preço" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="media" name="Média do mercado" stroke="var(--color-info)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="menor" name="Menor disponível" stroke="var(--color-success)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="pr-card p-6">
        <h2 className="inline-flex items-center gap-2 font-bold"><Sparkles className="size-4 text-primary" /> Análise inteligente</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Stat label="Custo" value={brl(product.cost)} />
          <Stat label="Margem atual" value={`${margin.toFixed(1)}%`} tone={margin >= minMargin ? "success" : "destructive"} />
          <Stat label="Preço recomendado" value={brl(recommended)} tone="info" />
          <Stat label="Margem recomendada" value={`${recMargin.toFixed(1)}%`} tone={belowMin ? "destructive" : "success"} />
        </div>
        {!analysis ? (
          <Button className="mt-5" onClick={() => setAnalysis(true)}>Analisar com IA</Button>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="rounded-xl bg-secondary/70 p-4 text-sm">
              Seu preço está {variation > 0 ? `${variation.toFixed(1)}% acima` : `${Math.abs(variation).toFixed(1)}% abaixo`} da média dos
              concorrentes disponíveis. O ajuste para {brl(recommended)} melhora a competitividade e mantém margem estimada de {recMargin.toFixed(1)}%.
              Estoque atual: {mine.stock} unidades.
            </p>
            {belowMin ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                🔴 Preço recomendado abaixo da margem mínima ({minMargin}%). Priorize rentabilidade.
              </p>
            ) : (
              <p className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm font-medium text-success">
                🟢 Preço dentro da margem mínima ({minMargin}%).
              </p>
            )}
            <Button disabled={belowMin || applied} onClick={() => { setApplied(true); toast.success(`Novo preço aplicado: ${brl(recommended)}`); }}>
              {applied ? "Recomendação aplicada" : "Aplicar recomendação"}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
