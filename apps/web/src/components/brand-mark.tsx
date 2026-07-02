import Link from "next/link";
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
      <ElementationLogoMark className="size-7 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {!compact ? (
        <span className="font-display text-foreground text-[19px] font-medium tracking-tight">
          Elementation
        </span>
      ) : null}
    </Link>
  );
}

export function ElementationLogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="28" height="28" rx="9" fill="#6a4bff" />
      <rect
        x="2.75"
        y="2.75"
        width="26.5"
        height="26.5"
        rx="8.25"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="1.5"
      />
      <path
        d="M10 14.75V11.4A1.4 1.4 0 0 1 11.4 10H14.75"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 17.25V20.6A1.4 1.4 0 0 1 20.6 22H17.25"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="13.3" y="13.3" width="5.4" height="5.4" rx="1.7" fill="#d8f36b" />
    </svg>
  );
}
