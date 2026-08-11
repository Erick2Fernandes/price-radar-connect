import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/pr/Stat";
import { toast } from "sonner";

export const Route = createFileRoute("/mercado/importar")({
  head: () => ({
    meta: [
      { title: "Importar preços — PreçoRadar" },
      { name: "description", content: "Atualize seu catálogo em segundos importando planilhas CSV ou XLSX." },
      { property: "og:title", content: "Importar preços — PreçoRadar" },
      { property: "og:description", content: "Atualize seu catálogo em poucos segundos." },
    ],
  }),
  component: Importar,
});

const revisao = [
  { arquivo: "Arroz Bom Grao 5 KG", sugestao: "Arroz 5kg · Bom Grão", conf: 94 },
  { arquivo: "CAFE TORRADO 500G SERRA", sugestao: "Café Torrado 500g · Serra Alta", conf: 91 },
  { arquivo: "LEITE INT 1L BOA VACA", sugestao: "Leite Integral 1L · Boa Vaca", conf: 88 },
];

function Importar() {
  const [state, setState] = useState<"idle" | "loading" | "result" | "review">("idle");

  const start = () => {
    setState("loading");
    setTimeout(() => setState("result"), 1600);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Importar preços</h1>
        <p className="text-sm text-muted-foreground">Atualize seu catálogo em poucos segundos.</p>
      </header>

      {state === "idle" && (
        <>
          <div
            onClick={start}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); start(); }}
            className="pr-card grid cursor-pointer place-items-center gap-3 border-2 border-dashed p-14 text-center transition-colors hover:border-primary"
          >
            <UploadCloud className="size-10 text-primary" />
            <p className="font-medium">Arraste sua planilha aqui</p>
            <p className="text-sm text-muted-foreground">CSV ou XLSX até 10 MB</p>
            <Button type="button">Escolher arquivo</Button>
          </div>
          <div className="pr-card p-5">
            <h2 className="inline-flex items-center gap-2 font-bold"><FileSpreadsheet className="size-4 text-primary" /> Formato esperado</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
                  <tr>{["EAN", "PRODUTO", "MARCA", "ESTOQUE", "PREÇO", "DISPONIBILIDADE"].map((h) => <th key={h} className="p-2 font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  <tr className="text-muted-foreground">
                    <td className="p-2">7891234567890</td><td className="p-2">Arroz 5kg</td><td className="p-2">Bom Grão</td>
                    <td className="p-2">84</td><td className="p-2">29,90</td><td className="p-2">Disponível</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {state === "loading" && (
        <div className="pr-card grid place-items-center gap-3 p-16 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="font-medium">Analisando arquivo...</p>
        </div>
      )}

      {state === "result" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Produtos encontrados" value={248} />
            <Stat label="Reconhecidos" value={217} tone="success" />
            <Stat label="Precisam de revisão" value={19} tone="warning" />
            <Stat label="Não identificados" value={12} tone="destructive" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setState("review")}>Revisar produtos</Button>
            <Button onClick={() => { toast.success("Importação concluída — 217 produtos atualizados"); setState("idle"); }}>
              <CheckCircle2 className="size-4" /> Concluir importação
            </Button>
          </div>
        </>
      )}

      {state === "review" && (
        <div className="space-y-3">
          <h2 className="font-bold">Revisão de produtos</h2>
          {revisao.map((r) => (
            <div key={r.arquivo} className="pr-card flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Arquivo</p>
                <p className="truncate font-medium">"{r.arquivo}"</p>
                <p className="mt-2 text-xs text-muted-foreground">Sugestão do catálogo central</p>
                <p className="truncate font-medium text-primary">{r.sugestao}</p>
              </div>
              <span className="rounded-full bg-success/12 px-3 py-1 text-sm font-semibold text-success">Confiança {r.conf}%</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => toast.success("Correspondência confirmada")}>Confirmar</Button>
                <Button size="sm" variant="outline" onClick={() => toast("Escolha manual (simulada)")}>Escolher outro</Button>
                <Button size="sm" variant="ghost" onClick={() => toast("Item ignorado")}>Ignorar</Button>
              </div>
            </div>
          ))}
          <Button onClick={() => setState("result")} variant="outline">Voltar ao resumo</Button>
        </div>
      )}
    </div>
  );
}
