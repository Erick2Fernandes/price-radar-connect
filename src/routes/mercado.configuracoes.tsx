import { createFileRoute } from "@tanstack/react-router";
import { Database, FileSpreadsheet, Plug } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePR } from "@/lib/pr/store";

export const Route = createFileRoute("/mercado/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — PreçoRadar" },
      { name: "description", content: "Controle a publicação de preços, margem mínima e integrações futuras (ERP, CSV, API)." },
      { property: "og:title", content: "Configurações — PreçoRadar" },
      { property: "og:description", content: "Privacidade, margem mínima e integrações." },
    ],
  }),
  component: Config,
});

const integracoes = [
  { icon: Database, t: "ERP", d: "Sincronização automática de preços e estoque" },
  { icon: FileSpreadsheet, t: "CSV / XLSX", d: "Importação manual de planilhas", ativo: true },
  { icon: Plug, t: "API", d: "Integração programática com sistemas próprios" },
];

const notificacoes = [
  "Seu preço está 8% acima da média.",
  "Concorrente reduziu preço.",
  "8 produtos estão sem estoque.",
  "12 produtos estão com dados desatualizados.",
];

function Config() {
  const { publishPrices, publishAvailability, minMargin, set } = usePR();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Privacidade, margem e integrações.</p>
      </header>

      <section className="pr-card space-y-5 p-6">
        <h2 className="font-bold">Privacidade e controle</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="pp">Publicar preços no PreçoRadar</Label>
            <p className="text-xs text-muted-foreground">Se desativado, seus preços não aparecem para clientes.</p>
          </div>
          <Switch id="pp" checked={publishPrices} onCheckedChange={(v) => set("publishPrices", v)} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="pd">Publicar disponibilidade</Label>
            <p className="text-xs text-muted-foreground">Mostra status de estoque no perfil público.</p>
          </div>
          <Switch id="pd" checked={publishAvailability} onCheckedChange={(v) => set("publishAvailability", v)} />
        </div>
      </section>

      <section className="pr-card p-6">
        <h2 className="font-bold">Margem mínima</h2>
        <p className="text-sm text-muted-foreground">Recomendações abaixo desse valor são bloqueadas.</p>
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            value={minMargin}
            onChange={(e) => set("minMargin", Number(e.target.value))}
            className="w-28"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </section>

      <section className="pr-card p-6">
        <h2 className="font-bold">Integrações</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {integracoes.map((i) => (
            <div key={i.t} className="rounded-xl border border-border p-4">
              <i.icon className="size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{i.t}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{i.d}</p>
              <p className={i.ativo ? "mt-3 text-xs font-medium text-success" : "mt-3 text-xs font-medium text-muted-foreground"}>
                {i.ativo ? "Disponível" : "Disponível em versão futura"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pr-card p-6">
        <h2 className="font-bold">Notificações do mercado</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {notificacoes.map((n) => <li key={n}>• {n}</li>)}
        </ul>
      </section>
    </div>
  );
}
