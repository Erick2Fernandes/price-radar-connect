import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { MvpBadge } from "./MvpBadge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface NavItem { to: string; label: string; icon: ReactNode; exact?: boolean }

export function AppShell({ nav, topbar, children, footerNote }: {
  nav: NavItem[]; topbar?: ReactNode; children: ReactNode; footerNote?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <Link
            key={item.to}
            to={item.to as "/"}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <span className="grid size-5 place-items-center">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-6 px-1"><Logo /></Link>
        {links}
        <div className="mt-auto space-y-2 px-1 pt-6">
          {footerNote && <p className="text-xs text-muted-foreground">{footerNote}</p>}
          <MvpBadge />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-4">
            <div className="mb-6 flex items-center justify-between">
              <Link to="/" onClick={() => setOpen(false)}><Logo /></Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fechar menu"><X className="size-5" /></Button>
            </div>
            {links}
            <div className="mt-auto pt-6"><MvpBadge /></div>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu className="size-5" />
            </Button>
            <Link to="/" className="lg:hidden"><Logo compact /></Link>
            <div className="min-w-0 flex-1">{topbar}</div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-16">{children}</main>
      </div>
    </div>
  );
}
