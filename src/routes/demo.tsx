import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, ShoppingCart, Store } from "lucide-react";
import { Logo } from "@/components/pr/Logo";
import { Button } from "@/components/ui/button";
import { usePR } from "@/lib/pr/store";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Ambiente de demonstração — PreçoRadar" },
      { name: "description", content: "Explore o PreçoRadar com dados fictícios pré-carregados: 5 mercados, 30+ produtos, preços, estoque e histórico." },
      { property: "og:title", content: "Ambiente de demonstração — PreçoRadar" },
      { property: "og:description", content: "Experimente todas as funcionalidades com dados simulados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Demo,
});

function Demo() {
  const { startDemo } = usePR();
  const navigate = useNavigate();

  const enter = (role: "cliente" | "mercado") => {
    startDemo(role);
    navigate({ to: role === "cliente" ? "/cliente" : "/mercado" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Logo />
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>Voltar</Button>
      </header>

      <section className="pr-hero-gradient">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <FlaskConical className="size-3.5 text-primary" /> Dados fictícios pré-carregados
          </span>
          <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">🧪 Ambiente de demonstração</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Explore o PreçoRadar utilizando dados fictícios. Escolha um perfil e navegue por todas as
            funcionalidades — busca, comparação, lista, alertas e análise inteligente.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <article className="pr-card p-6 text-left">
              <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                <ShoppingCart className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold">👤 Explorar como cliente</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Lista inicial sugerida, comparação de cesta e economia calculada.
              </p>
              <Button className="mt-5 w-full" size="lg" onClick={() => enter("cliente")}>
                Explorar como cliente <ArrowRight className="size-4" />
              </Button>
            </article>

            <article className="pr-card p-6 text-left">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-deep text-primary-foreground">
                <Store className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold">🏪 Explorar como mercado</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Entre como Mercado Aurora: catálogo, concorrentes, alertas e recomendações.
              </p>
              <Button variant="secondary" className="mt-5 w-full" size="lg" onClick={() => enter("mercado")}>
                Explorar como mercado <ArrowRight className="size-4" />
              </Button>
            </article>
          </div>

          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-border bg-card p-4 text-left text-xs text-muted-foreground">
            Os dados apresentados neste ambiente são simulados e servem apenas para demonstração.
            5 mercados, 30+ produtos, preços, disponibilidade, estoque, datas de atualização e
            histórico de preços já vêm carregados — nenhum cadastro, planilha ou API é necessário.
          </div>
        </div>
      </section>
    </div>
  );
}