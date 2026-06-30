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
        "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm",
        className,
      )}
    >
      <div className="flex h-11 items-center justify-between border-b border-slate-200 bg-[#f8fbff] px-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#f36b6d]" />
          <span className="size-2.5 rounded-full bg-[#f4bd4f]" />
          <span className="size-2.5 rounded-full bg-[#2bbf78]" />
        </div>
        <span className="font-mono text-[11px] text-slate-400">{language ?? "code"}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-700">
        <code className="font-mono">{code}</code>
      </pre>
      <div className="absolute right-2 top-12 opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton
          value={code}
          variant="ghost"
          size="sm"
          label=""
          aria-label={`Copy ${language ?? "code"}`}
          className="text-slate-500 hover:bg-[#f4f8ff] hover:text-[#2f6fed]"
        />
      </div>
    </div>
  );
}
