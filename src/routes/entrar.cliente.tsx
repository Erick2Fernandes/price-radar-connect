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

export const Route = createFileRoute("/entrar/cliente")({
  head: () => ({
    meta: [
      { title: "Entrar como cliente — PreçoRadar" },
      { name: "description", content: "Acesse o PreçoRadar como cliente e compare preços de supermercados perto de você." },
      { property: "og:title", content: "Entrar como cliente — PreçoRadar" },
      { property: "og:description", content: "Compare preços e descubra onde comprar mais barato." },
    ],
  }),
  component: LoginCliente,
});

function LoginCliente() {
  const navigate = useNavigate();
  const { set } = usePR();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("cliente@demo.com");
  const [name, setName] = useState("Ana");

  const enter = (guest: boolean) => {
    set("role", "cliente");
    set("guest", guest);
    set("userName", guest ? "Visitante" : mode === "signup" ? name : email.split("@")[0]);
    toast.success(guest ? "Entrando como visitante" : "Bem-vindo ao PreçoRadar!");
    navigate({ to: "/cliente" });
  };

  return (
    <div className="pr-hero-gradient flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/"><Logo /></Link>
        <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="size-4" /> Voltar</Link></Button>
      </div>
      <div className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="pr-card w-full max-w-md p-7">
          <h1 className="text-2xl font-bold">👤 Entrar como cliente</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Acesse sua conta para salvar listas e favoritos." : "Crie sua conta gratuita."}
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => { e.preventDefault(); enter(false); }}
          >
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" defaultValue="123456" required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
          <Button variant="outline" className="mt-3 w-full" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Criar conta" : "Já tenho conta"}
          </Button>
          <Button variant="ghost" className="mt-2 w-full" onClick={() => enter(true)}>
            Continuar como visitante
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Visitantes podem pesquisar preços. Listas, favoritos e alertas exigem cadastro.
          </p>
          <div className="mt-4"><MvpBadge /></div>
        </div>
      </div>
    </div>
  );
}
