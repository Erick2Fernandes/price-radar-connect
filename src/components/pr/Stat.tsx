import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Stat({ label, value, hint, tone = "default", icon }: {
  label: string; value: ReactNode; hint?: string; icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "destructive" | "info";
}) {
  const tones = {
    default: "text-foreground", success: "text-success", warning: "text-warning",
    destructive: "text-destructive", info: "text-info",
  } as const;
  return (
    <div className="pr-card p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className={cn("mt-2 font-display text-2xl font-bold", tones[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
