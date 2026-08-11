import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ScanLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusDot } from "@/components/pr/StatusDot";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ago, brl, myCatalog, productById } from "@/lib/pr/data";
import { toast } from "sonner";

export const Route = createFileRoute("/mercado/catalogo")({
  head: () => ({
    meta: [
      { title: "Meu catálogo — PreçoRadar" },
      { name: "description", content: "Gerencie os produtos comercializados pelo seu mercado: preço, estoque e disponibilidade." },
      { property: "og:title", content: "Meu catálogo — PreçoRadar" },
      { property: "og:description", content: "Produtos, preços, estoque e disponibilidade." },
    ],
  }),
  component: Catalogo,
});

const campos = ["EAN", "Nome", "Marca", "Categoria", "Subcategoria", "Peso", "Preço", "Estoque"];

function Catalogo() {
  const [q, setQ] = useState("");
  const rows = myCatalog().filter((o) => {
    const p = productById(o.productId)!;
    return (p.name + p.ean + p.category).toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Meu catálogo</h1>
          <p className="text-sm text-muted-foreground">
            O catálogo central identifica o produto; aqui você define se comercializa, o preço e o estoque.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ScanDialog />
          <AddDialog />
        </div>
      </header>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar no catálogo" className="pl-9" />
      </div>

      <div className="pr-card overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
            <tr>
              {["Produto", "EAN", "Categoria", "Preço", "Estoque", "Disponibilidade", "Última atualização", "Status"].map((h) => (
                <th key={h} className="p-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((o) => {
              const p = productById(o.productId)!;
              return (
                <tr key={o.productId} className="hover:bg-secondary/40">
                  <td className="p-3 font-medium">
                    <Link to="/mercado/comparar" search={{ p: p.id }} className="hover:underline">{p.emoji} {p.name}</Link>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.ean}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{o.status === "not_carried" ? "—" : brl(o.price)}</td>
                  <td className="p-3">{o.status === "not_carried" ? "—" : o.stock}</td>
                  <td className="p-3"><StatusDot status={o.status} /></td>
                  <td className="p-3 text-muted-foreground">{ago(o.updatedMinutesAgo)}</td>
                  <td className="p-3">
                    <span className={o.status === "stale" ? "text-info" : "text-success"}>
                      {o.status === "stale" ? "Revisar" : "Atualizado"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button><Plus className="size-4" /> Adicionar produto</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Adicionar produto</DialogTitle></DialogHeader>
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Produto adicionado ao catálogo (simulado)"); }}>
          {campos.map((c) => (
            <div key={c} className="space-y-1.5">
              <Label htmlFor={c}>{c}</Label>
              <Input id={c} />
            </div>
          ))}
          <Button type="submit" className="sm:col-span-2">Salvar produto</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ScanDialog() {
  const [step, setStep] = useState<"scan" | "found" | "done">("scan");
  return (
    <Dialog onOpenChange={() => setStep("scan")}>
      <DialogTrigger asChild><Button variant="outline"><ScanLine className="size-4" /> Escanear código</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Escanear código de barras</DialogTitle></DialogHeader>
        {step === "scan" && (
          <div className="space-y-4 text-center">
            <div className="grid h-40 place-items-center rounded-xl border-2 border-dashed border-border bg-secondary/40">
              <ScanLine className="size-10 animate-pulse text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Leitura simulada no MVP.</p>
            <Button onClick={() => setStep("found")}>Simular leitura</Button>
          </div>
        )}
        {step === "found" && (
          <div className="space-y-4">
            <div className="pr-card p-4">
              <p className="font-semibold">🍚 Arroz 5kg · Bom Grão</p>
              <p className="text-xs text-muted-foreground">EAN 7891234567890</p>
            </div>
            <p className="font-medium">Você comercializa este produto?</p>
            <div className="flex gap-2">
              <Button onClick={() => setStep("done")}>Sim</Button>
              <Button variant="outline" onClick={() => { toast("Marcado como não comercializado"); setStep("scan"); }}>Não</Button>
            </div>
          </div>
        )}
        {step === "done" && (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Produto atualizado (simulado)"); setStep("scan"); }}>
            <div className="space-y-1.5"><Label htmlFor="s-preco">Preço</Label><Input id="s-preco" defaultValue="29,90" /></div>
            <div className="space-y-1.5"><Label htmlFor="s-est">Estoque</Label><Input id="s-est" defaultValue="84" /></div>
            <Button type="submit" className="w-full">Salvar</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
