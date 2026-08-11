import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/pr/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MvpBadge } from "@/components/pr/MvpBadge";
import { usePR } from "@/lib/pr/store";
import { toast } from "sonner";

export const Route = createFileRoute("/entrar/mercado")({
  head: () => ({
    meta: [
      { title: "Entrar como mercado — PreçoRadar" },
      { name: "description", content: "Acesse o painel do varejista: monitore concorrentes, margem e oportunidades de preço." },
      { property: "og:title", content: "Entrar como mercado — PreçoRadar" },
      { property: "og:description", content: "Monitore preços, concorrentes e margem em um só painel." },
    ],
  }),
  component: LoginMercado,
});

const campos = [
  ["Nome do mercado", "Mercado Aurora"],
  ["CNPJ (demonstrativo)", "12.345.678/0001-90"],
  ["E-mail corporativo", "contato@aurora.com.br"],
  ["Telefone", "(51) 99999-0000"],
  ["Cidade", "Viamão"],
  ["Estado", "RS"],
  ["Endereço", "Av. Senador Salgado Filho, 1240"],
  ["Responsável", "Carlos Menezes"],
];

function LoginMercado() {
  const navigate = useNavigate();
  const { set } = usePR();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const enter = () => {
    set("role", "mercado");
    set("guest", false);
    toast.success("Painel do mercado carregado");
    navigate({ to: "/mercado" });
  };

  return (
    <div className="pr-hero-gradient flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/"><Logo /></Link>
        <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="size-4" /> Voltar</Link></Button>
      </div>
      <div className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="pr-card w-full max-w-lg p-7">
          <h1 className="text-2xl font-bold">🏪 Entrar como mercado</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse o painel de inteligência competitiva." : "Cadastre seu mercado no PreçoRadar."}
          </p>
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); enter(); }}>
            {mode === "login" ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="mail">E-mail corporativo</Label>
                  <Input id="mail" type="email" defaultValue="contato@aurora.com.br" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pass">Senha</Label>
                  <Input id="pass" type="password" defaultValue="123456" required />
                </div>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {campos.map(([label, val]) => (
                  <div key={label} className="space-y-1.5">
                    <Label htmlFor={label}>{label}</Label>
                    <Input id={label} defaultValue={val} required />
                  </div>
                ))}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="senha-m">Senha</Label>
                  <Input id="senha-m" type="password" defaultValue="123456" required />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" size="lg">
              {mode === "login" ? "Entrar" : "Cadastrar mercado"}
            </Button>
          </form>
          <Button variant="outline" className="mt-3 w-full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Cadastrar mercado" : "Já tenho acesso"}
          </Button>
          <div className="mt-4"><MvpBadge /></div>
        </div>
      </div>
    </div>
  );
}
