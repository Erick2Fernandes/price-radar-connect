import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Building2, LineChart, MapPin, ShieldCheck, ShoppingCart, Sparkles, Store, Users } from "lucide-react";
import { Logo } from "@/components/pr/Logo";
import { Button } from "@/components/ui/button";
import { MvpBadge } from "@/components/pr/MvpBadge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PreçoRadar — Compare. Economize. Venda melhor." },
      { name: "description", content: "Plataforma de inteligência de preços que conecta consumidores e supermercados: compare preços, monte sua lista e monitore a concorrência." },
      { property: "og:title", content: "PreçoRadar — Inteligência de preços" },
      { property: "og:description", content: "Uma plataforma. Dois lados. Mais inteligência para o varejo." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/entrar/cliente">Cliente</Link></Button>
          <Button asChild size="sm"><Link to="/entrar/mercado">Sou mercado</Link></Button>
        </div>
      </header>

      <section className="pr-hero-gradient">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" /> Inteligência de preços para o varejo alimentar
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl leading-tight font-extrabold sm:text-6xl">
            <span className="pr-gradient-text">Compare. Economize.</span>
            <br />
            Venda melhor.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Inteligência de preços conectando consumidores e varejistas. Um só lugar para descobrir
            onde comprar mais barato — e para entender como seu mercado está posicionado.
          </p>

          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            <article className="pr-card group p-7 text-left transition-shadow hover:shadow-lift">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <ShoppingCart className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold">👤 Sou cliente</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Compare preços, encontre produtos e descubra onde comprar mais barato.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li>• Busca de produtos em vários mercados</li>
                <li>• Lista de compras com comparação de cesta</li>
                <li>• Alertas de preço e oportunidades</li>
              </ul>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link to="/entrar/cliente">Entrar como cliente <ArrowRight className="size-4" /></Link>
              </Button>
            </article>

            <article className="pr-card group p-7 text-left transition-shadow hover:shadow-lift">
              <span className="grid size-12 place-items-center rounded-2xl bg-brand-deep text-primary-foreground">
                <Store className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold">🏪 Sou mercado</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Monitore preços, acompanhe concorrentes e transforme dados em decisões.
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li>• Catálogo próprio, estoque e disponibilidade</li>
                <li>• Comparação competitiva e análise de margem</li>
                <li>• Alertas, recomendações e Expoagro</li>
              </ul>
              <Button asChild variant="secondary" className="mt-6 w-full" size="lg">
                <Link to="/entrar/mercado">Entrar como mercado <ArrowRight className="size-4" /></Link>
              </Button>
            </article>
          </div>

          <p className="mt-8 text-sm font-medium text-muted-foreground">
            Uma plataforma. Dois lados. Mais inteligência para o varejo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart3, t: "Dados", d: "Catálogo central + catálogo de cada mercado." },
            { icon: LineChart, t: "Comparação", d: "Preço, disponibilidade e data da atualização." },
            { icon: Sparkles, t: "Inteligência", d: "Recomendações que respeitam a margem mínima." },
            { icon: ShieldCheck, t: "Decisão", d: "Ações claras para consumidor e varejista." },
          ].map((f) => (
            <div key={f.t} className="pr-card p-5">
              <f.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-base font-bold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">O efeito de rede do PreçoRadar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Quanto mais mercados participam, melhores ficam as informações para os consumidores.
            Quanto mais consumidores utilizam o PreçoRadar, maior a oportunidade dos mercados
            entenderem sua posição competitiva.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
            {[
              { icon: Building2, t: "Mercados", d: "Mais dados de preço e disponibilidade" },
              { icon: LineChart, t: "Plataforma", d: "Melhores comparações e inteligência" },
              { icon: Users, t: "Clientes", d: "Mais uso → mais valor para os mercados" },
            ].map((s, i) => (
              <div key={s.t} className="pr-card relative p-5 text-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <s.icon className="mx-auto mt-2 size-6 text-primary" />
                <h3 className="mt-3 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="pr-card p-7">
            <MapPin className="size-5 text-primary" />
            <h3 className="mt-3 text-xl font-bold">Para o cliente</h3>
            <p className="mt-2 text-muted-foreground">"Descubra onde comprar melhor."</p>
            <Button asChild variant="outline" className="mt-5"><Link to="/entrar/cliente">Começar agora</Link></Button>
          </div>
          <div className="pr-card p-7">
            <BarChart3 className="size-5 text-primary" />
            <h3 className="mt-3 text-xl font-bold">Para o mercado</h3>
            <p className="mt-2 text-muted-foreground">"Descubra como vender melhor."</p>
            <Button asChild variant="outline" className="mt-5"><Link to="/entrar/mercado">Ver painel</Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
          <Logo />
          <p className="text-sm text-muted-foreground">Compare. Economize. Venda melhor.</p>
          <MvpBadge />
        </div>
      </footer>
    </div>
  );
}
