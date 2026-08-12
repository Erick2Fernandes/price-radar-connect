import { useNavigate } from "@tanstack/react-router";
import { FlaskConical, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePR } from "@/lib/pr/store";

export function DemoBanner() {
  const { demo, exitDemo } = usePR();
  const navigate = useNavigate();
  if (!demo) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-accent px-4 py-2 text-accent-foreground">
      <p className="flex items-center gap-2 text-xs font-semibold">
        <FlaskConical className="size-4" />
        🧪 Ambiente de demonstração
        <span className="font-normal opacity-80">· dados fictícios</span>
      </p>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 gap-1.5 text-xs"
        onClick={() => { exitDemo(); navigate({ to: "/" }); }}
      >
        <LogOut className="size-3.5" /> Sair da demonstração
      </Button>
    </div>
  );
}
