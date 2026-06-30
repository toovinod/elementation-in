import Link from "next/link";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      aria-label="Elementation home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid size-8 place-items-center rounded-lg bg-[#eef5ff] text-[#2f6fed] ring-1 ring-[#cfe0ff]">
        <MousePointer2 className="size-4 -rotate-12" strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-[#f36b6d] ring-2 ring-[#fbfaf8]" />
      </span>
      {!compact ? (
        <span className="text-[15px] font-semibold tracking-tight text-slate-900">
          Elementation
        </span>
      ) : null}
    </Link>
  );
}
