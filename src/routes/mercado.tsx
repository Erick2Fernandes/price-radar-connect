import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BarChart3, Bell, Building2, Handshake, LayoutDashboard, Lightbulb, Package, Settings, ShoppingBasket, Store, Upload } from "lucide-react";
import { AppShell, type NavItem } from "@/components/pr/AppShell";

export const Route = createFileRoute("/mercado")({ component: MercadoLayout });

const nav: NavItem[] = [
  { to: "/mercado", label: "Dashboard", icon: <LayoutDashboard className="size-4" />, exact: true },
  { to: "/mercado/catalogo", label: "Catálogo", icon: <Package className="size-4" /> },
  { to: "/mercado/meu-mercado", label: "Meu Mercado", icon: <Store className="size-4" /> },
  { to: "/mercado/importar", label: "Importar preços", icon: <Upload className="size-4" /> },
  { to: "/mercado/comparar", label: "Comparar mercado", icon: <BarChart3 className="size-4" /> },
  { to: "/mercado/concorrentes", label: "Concorrentes", icon: <Building2 className="size-4" /> },
  { to: "/mercado/alertas", label: "Alertas", icon: <Bell className="size-4" /> },
  { to: "/mercado/oportunidades", label: "Oportunidades", icon: <Lightbulb className="size-4" /> },
  { to: "/mercado/cesta", label: "Cesta estratégica", icon: <ShoppingBasket className="size-4" /> },
  { to: "/mercado/expoagro", label: "Expoagro", icon: <Handshake className="size-4" /> },
  { to: "/mercado/configuracoes", label: "Configurações", icon: <Settings className="size-4" /> },
];

function MercadoLayout() {
  return (
    <AppShell
      nav={nav}
      footerNote="Painel do varejista"
      topbar={
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Mercado Aurora</p>
            <p className="truncate text-xs text-muted-foreground">Viamão, RS · plano demonstrativo</p>
          </div>
          <span className="hidden rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground sm:inline">
            Dados demonstrativos
          </span>
        </div>
      }
    >
      <Outlet />
    </AppShell>
  );
}
