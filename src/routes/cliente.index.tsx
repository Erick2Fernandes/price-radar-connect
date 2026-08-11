import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Store, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePR } from "@/lib/pr/store";
import { brl, compareBasket, marketById, products } from "@/lib/pr/data";

export const Route = createFileRoute("/cliente/")({
  head: () => ({
    meta: [
      { title: "Início do cliente — PreçoRadar" },
      { name: "description", content: "Pesquise produtos e encontre os melhores preços perto de você." },
      { property: "og:title", content: "Início do cliente — PreçoRadar" },
      { property: "og:description", content: "Encontre os melhores preços perto de você." },
    ],
  }),
  component: ClienteHome,
});

const populares = ["Arroz", "Feijão", "Café", "Leite", "Açúcar", "Óleo"];

function ClienteHome() {
  const navigate = useNavigate();
  const { userName, list } = usePR();
  const [q, setQ] = useState("");
  const best = compareBasket(list)[0];

  return (
    <div className="space-y-8">
      <section className="pr-card pr-hero-gradient p-7">
        <h1 className="text-2xl font-bold sm:text-3xl">Olá{userName !== "Visitante" ? `, ${userName}` : ""}, tudo bem? 👋</h1>
        <p className="mt-1 text-muted-foreground">Encontre os melhores preços perto de você.</p>
        <form
          className="relative mt-6 max-w-2xl"
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/cliente/buscar", search: { q } }); }}
        >
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Digite um produto..."
            className="h-14 rounded-2xl pr-32 pl-12 text-base"
            aria-label="Digite um produto"
          />
          <Button type="submit" className="absolute top-2 right-2 h-10">Buscar</Button>
        </form>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground">Pesquisas populares</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {populares.map((p) => {
            const prod = products.find((x) => x.name.toLowerCase().includes(p.toLowerCase()));
            return (
              <Link
                key={p}
                to="/cliente/buscar"
                search={{ q: p }}
                className="pr-card flex flex-col items-center gap-2 p-4 transition-shadow hover:shadow-lift"
              >
                <span className="text-2xl">{prod?.emoji ?? "🛒"}</span>
                <span className="text-sm font-medium">{p}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="pr-card p-6">
          <Sparkles className="size-5 text-primary" />
          <h3 className="mt-3 font-bold">Sua lista está pronta para comparar</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {list.length} itens · melhor cesta hoje em <strong>{marketById(best?.marketId ?? "m1")?.name}</strong> por {brl(best?.total ?? 0)}.
          </p>
          <Button asChild className="mt-4"><Link to="/cliente/lista">Comparar mercados</Link></Button>
        </div>
        <div className="pr-card p-6">
          <TrendingDown className="size-5 text-success" />
          <h3 className="mt-3 font-bold">Oportunidades de economia</h3>
          <p className="mt-1 text-sm text-muted-foreground">Detectamos quedas de preço em produtos que você acompanha.</p>
          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline"><Link to="/cliente/oportunidades">Economize mais</Link></Button>
            <Button asChild variant="ghost"><Link to="/cliente/proximos"><Store className="size-4" /> Mercados próximos</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
