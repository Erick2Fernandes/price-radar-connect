import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Home, MapPin, Search, Settings, ShoppingBasket, Store, TrendingDown, User } from "lucide-react";
import { AppShell, type NavItem } from "@/components/pr/AppShell";
import { Input } from "@/components/ui/input";
import { usePR } from "@/lib/pr/store";

export const Route = createFileRoute("/cliente")({ component: ClienteLayout });

const nav: NavItem[] = [
  { to: "/cliente", label: "Início", icon: <Home className="size-4" />, exact: true },
  { to: "/cliente/buscar", label: "Buscar produtos", icon: <Search className="size-4" /> },
  { to: "/cliente/lista", label: "Minha lista", icon: <ShoppingBasket className="size-4" /> },
  { to: "/cliente/mercados", label: "Mercados", icon: <Store className="size-4" /> },
  { to: "/cliente/oportunidades", label: "Oportunidades", icon: <TrendingDown className="size-4" /> },
  { to: "/cliente/favoritos", label: "Favoritos", icon: <Heart className="size-4" /> },
  { to: "/cliente/proximos", label: "Mercados próximos", icon: <MapPin className="size-4" /> },
  { to: "/cliente/conta", label: "Minha conta", icon: <Settings className="size-4" /> },
];

function ClienteLayout() {
  const navigate = useNavigate();
  const { userName } = usePR();
  const [q, setQ] = useState("");

  return (
    <AppShell nav={nav} footerNote="Área do cliente">
      <div className="flex items-center gap-3">
        <form
          className="relative min-w-0 flex-1"
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/cliente/buscar", search: { q } }); }}
        >
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="O que você está procurando?"
            className="pl-9"
            aria-label="Buscar produtos"
          />
        </form>
        <span className="hidden items-center gap-1 text-xs font-medium text-muted-foreground sm:flex">
          <MapPin className="size-3.5 text-primary" /> Viamão, RS
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground" title={userName}>
          <User className="size-4" />
        </span>
      </div>
      <div className="pt-6"><Outlet /></div>
    </AppShell>
  );
}
