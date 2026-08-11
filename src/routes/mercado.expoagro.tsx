import { createFileRoute } from "@tanstack/react-router";
import { Handshake, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/mercado/expoagro")({
  head: () => ({
    meta: [
      { title: "Expoagro — PreçoRadar" },
      { name: "description", content: "Conecte pressões de custo a fornecedores e oportunidades de negociação na Expoagro." },
      { property: "og:title", content: "Expoagro — PreçoRadar" },
      { property: "og:description", content: "Fornecedores e oportunidades de redução de custo." },
    ],
  }),
  component: Expoagro,
});

const fornecedores = [
  { nome: "Fornecedor A", compat: 94, reducao: 6 },
  { nome: "Fornecedor B", compat: 89, reducao: 4 },
  { nome: "Fornecedor C", compat: 86, reducao: 8 },
];

function Expoagro() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Expoagro</h1>
        <p className="text-sm text-muted-foreground">Da pressão de custo à negociação com fornecedores.</p>
      </header>

      <section className="pr-card border-warning/40 bg-warning/10 p-5">
        <h2 className="font-bold">Problema detectado</h2>
        <p className="mt-1 text-sm">"Custo do Arroz está pressionando sua margem."</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {fornecedores.map((f) => (
          <article key={f.nome} className="pr-card p-5">
            <Handshake className="size-5 text-primary" />
            <h3 className="mt-3 font-bold">{f.nome}</h3>
            <p className="mt-2 text-sm text-muted-foreground">Compatibilidade <strong className="text-foreground">{f.compat}%</strong></p>
            <p className="inline-flex items-center gap-1 text-sm text-success">
              <TrendingDown className="size-4" /> Potencial redução {f.reducao}%
            </p>
            <Button size="sm" className="mt-4" onClick={() => toast.success(`Contato solicitado com ${f.nome}`)}>Solicitar contato</Button>
          </article>
        ))}
      </div>
    </div>
  );
}
