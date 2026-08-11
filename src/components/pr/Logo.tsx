import { Radar } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Radar className="size-5" />
      </span>
      {!compact && (
        <span className="font-display text-lg leading-none font-extrabold tracking-tight">
          <span className="text-brand-deep">PREÇO</span>
          <span className="text-primary">RADAR</span>
        </span>
      )}
    </span>
  );
}
