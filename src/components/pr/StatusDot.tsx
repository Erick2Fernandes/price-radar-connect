import { availabilityMeta, type Availability } from "@/lib/pr/data";
import { cn } from "@/lib/utils";

export function StatusDot({ status, className }: { status: Availability; className?: string }) {
  const m = availabilityMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", m.text, className)}>
      <span className={cn("size-2 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
