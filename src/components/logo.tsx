import { cn } from "@/lib/utils";
import { Shell } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Shell className="h-7 w-7 text-primary" />
      <h1 className="font-headline text-xl font-bold tracking-tight text-primary-foreground">
        Asociacion Camino Bizkaia
      </h1>
    </div>
  );
}
