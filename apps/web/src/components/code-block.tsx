import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "border-border bg-card text-foreground group relative overflow-hidden rounded-2xl border shadow-sm",
        className,
      )}
    >
      <div className="border-border bg-muted flex h-11 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <span className="bg-primary/70 size-2.5 rounded-full" />
          <span className="bg-highlight size-2.5 rounded-full" />
          <span className="bg-border size-2.5 rounded-full" />
        </div>
        <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
          {language ?? "code"}
        </span>
      </div>
      <pre className="text-foreground/80 overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
      <div className="absolute right-2 top-12 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton
          value={code}
          variant="ghost"
          size="sm"
          label=""
          aria-label={`Copy ${language ?? "code"}`}
          className="text-muted-foreground hover:bg-secondary hover:text-primary"
        />
      </div>
    </div>
  );
}
