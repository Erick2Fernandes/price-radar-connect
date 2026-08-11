import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Trophy } from "lucide-react";
import { StatusDot } from "./StatusDot";
import { Button } from "@/components/ui/button";
import { ago, brl, marketById, type Offer } from "@/lib/pr/data";
import { cn } from "@/lib/utils";

export function OfferCard({ offer, best }: { offer: Offer; best?: boolean }) {
  const m = marketById(offer.marketId);
  if (!m) return null;
  return (
    <div className={cn("pr-card p-5", best && "ring-2 ring-primary")}>
      {best && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary-foreground uppercase">
          <Trophy className="size-3" /> Melhor preço disponível
        </span>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">🏪 {m.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <StatusDot status={offer.status} />
            <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {m.distanceKm} km</span>
            <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> Atualizado {ago(offer.updatedMinutesAgo)}</span>
          </div>
        </div>
        <p className="font-display shrink-0 text-2xl font-bold">{brl(offer.price)}</p>
      </div>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link to="/cliente/mercados/$marketId" params={{ marketId: m.id }}>Ver mercado</Link>
      </Button>
    </div>
  );
}
