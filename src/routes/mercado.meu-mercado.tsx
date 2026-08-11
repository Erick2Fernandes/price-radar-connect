import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stat } from "@/components/pr/Stat";
import { myCatalog } from "@/lib/pr/data";
import { toast } from "sonner";

export const Route = createFileRoute("/mercado/meu-mercado")({
  head: () => ({
    meta: [
      { title: "Meu mercado — PreçoRadar" },
      { name: "description", content: "Dados cadastrais, horário e cobertura de catálogo do seu supermercado." },
      { property: "og:title", content: "Meu mercado — PreçoRadar" },
      { property: "og:description", content: "Perfil e cobertura do seu supermercado." },
    ],
  }),
  component: MeuMercado,
});

const dados: [string, string][] = [
  ["Nome do mercado", "Mercado Aurora"],
  ["CNPJ (demonstrativo)", "12.345.678/0001-90"],
  ["E-mail corporativo", "contato@aurora.com.br"],
  ["Telefone", "(51) 99999-0000"],
  ["Cidade", "Viamão"],
  ["Estado", "RS"],
  ["Endereço", "Av. Senador Salgado Filho, 1240"],
  ["Responsável", "Carlos Menezes"],
  ["Horário", "07h – 22h"],
];

function MeuMercado() {
  const cat = myCatalog();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Meu Mercado</h1>
        <p className="text-sm text-muted-foreground">Perfil exibido para os clientes do PreçoRadar.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Itens no catálogo" value={cat.filter((o) => o.status !== "not_carried").length} />
        <Stat label="Não comercializados" value={cat.filter((o) => o.status === "not_carried").length} />
        <Stat label="Cobertura" value="87%" tone="success" />
      </div>

      <form className="pr-card grid gap-4 p-6 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Dados salvos"); }}>
        {dados.map(([label, val]) => (
          <div key={label} className="space-y-1.5">
            <Label htmlFor={label}>{label}</Label>
            <Input id={label} defaultValue={val} />
          </div>
        ))}
        <Button type="submit" className="sm:col-span-2 sm:w-fit">Salvar alterações</Button>
      </form>
    </div>
  );
}
