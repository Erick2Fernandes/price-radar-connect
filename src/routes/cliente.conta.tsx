import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { brl, productById } from "@/lib/pr/data";
import { usePR } from "@/lib/pr/store";
import { signOutUser } from "@/lib/pr/auth";

export const Route = createFileRoute("/cliente/conta")({
  head: () => ({
    meta: [
      { title: "Minha conta — PreçoRadar" },
      { name: "description", content: "Gerencie seus dados, notificações e alertas de preço no PreçoRadar." },
      { property: "og:title", content: "Minha conta — PreçoRadar" },
      { property: "og:description", content: "Preferências e alertas de preço." },
    ],
  }),
  component: Conta,
});

const notificacoes = [
  "Seu produto favorito ficou mais barato.",
  "O Café 500g atingiu seu preço desejado.",
  "Encontramos uma opção mais barata para sua lista.",
];

function Conta() {
  const { userName, guest, demo, alerts, removeAlert, resetDemo } = usePR();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Minha conta</h1>
        <p className="text-sm text-muted-foreground">{guest ? "Você está navegando como visitante." : `Conta de ${userName}`}</p>
      </header>

      <section className="pr-card space-y-4 p-6">
        <h2 className="font-bold">Preferências</h2>
        {["Notificações de queda de preço", "Resumo semanal de economia", "Alertas de disponibilidade"].map((t, i) => (
          <div key={t} className="flex items-center justify-between gap-4">
            <Label htmlFor={`pref-${i}`} className="text-sm font-normal">{t}</Label>
            <Switch id={`pref-${i}`} defaultChecked={i !== 2} />
          </div>
        ))}
      </section>

      <section className="pr-card p-6">
        <h2 className="inline-flex items-center gap-2 font-bold"><Bell className="size-4" /> Alertas de preço</h2>
        {alerts.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nenhum alerta ativo. Crie um na página de um produto.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {alerts.map((a) => (
              <li key={a.productId} className="flex items-center justify-between gap-3 text-sm">
                <span>🔔 {productById(a.productId)?.name} — avisar em {brl(a.target)}</span>
                <Button variant="ghost" size="sm" onClick={() => removeAlert(a.productId)}>Remover</Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pr-card p-6">
        <h2 className="font-bold">Notificações recentes</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {notificacoes.map((n) => <li key={n}>• {n}</li>)}
        </ul>
      </section>

      {demo && (
        <section className="pr-card p-6">
          <h2 className="font-bold">Ambiente de demonstração</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Restaure a lista, favoritos e alertas para o estado original da demonstração.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-4 gap-2">
                <RotateCcw className="size-4" /> Resetar ambiente de demonstração
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Resetar ambiente de demonstração</AlertDialogTitle>
                <AlertDialogDescription>Todos os dados demonstrativos serão restaurados.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => { resetDemo(); toast.success("Ambiente de demonstração restaurado."); }}>
                  Restaurar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      )}

      <Button
        variant="outline"
        onClick={async () => { await signOutUser(); toast.success("Sessão encerrada."); navigate({ to: "/" }); }}
      >
        <LogOut className="size-4" /> Sair
      </Button>
    </div>
  );
}
