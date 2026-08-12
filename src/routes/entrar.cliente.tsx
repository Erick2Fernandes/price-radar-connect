import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/pr/Logo";
import { Button } from "@/components/ui/button";
import { MvpBadge } from "@/components/pr/MvpBadge";
import { EmailCodeForm } from "@/components/pr/EmailCodeForm";
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

  const enter = (guest: boolean, name?: string) => {
    set("role", "cliente");
    set("guest", guest);
    set("demo", false);
    set("userName", guest ? "Visitante" : (name ?? "Cliente"));
    if (guest) toast.success("Entrando como visitante");
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
            Cadastre-se ou entre com seu e-mail: enviamos um código de verificação.
          </p>
          <EmailCodeForm role="cliente" onAuthenticated={(name) => enter(false, name)} />
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
