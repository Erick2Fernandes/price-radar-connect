import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/pr/Logo";
import { Button } from "@/components/ui/button";
import { MvpBadge } from "@/components/pr/MvpBadge";
import { EmailCodeForm } from "@/components/pr/EmailCodeForm";
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

function LoginMercado() {
  const navigate = useNavigate();
  const { set } = usePR();

  const enter = (name: string) => {
    set("role", "mercado");
    set("guest", false);
    set("demo", false);
    set("userName", name || "Meu mercado");
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
            Cadastre seu mercado com o e-mail corporativo: enviamos um código de verificação.
          </p>
          <EmailCodeForm role="mercado" extraLabel="Nome do mercado" onAuthenticated={enter} />
          <div className="mt-4"><MvpBadge /></div>
        </div>
      </div>
    </div>
  );
}
