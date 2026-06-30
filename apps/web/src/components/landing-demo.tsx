import {
  Braces,
  Check,
  Copy,
  FileCode2,
  MousePointer2,
  Palette,
  PenLine,
  ScanLine,
} from "lucide-react";

export function LandingDemo() {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl">
      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(48,67,93,0.12)] lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative min-h-[430px] bg-[#f8fbff] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="grid size-8 place-items-center rounded-lg bg-[#eef5ff] text-[#2f6fed]">
              <MousePointer2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Checkout preview</p>
              <p className="text-xs text-slate-400">localhost:3000/pricing</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-[#fff2d9]" />
                <div>
                  <div className="h-3 w-28 rounded-full bg-slate-200" />
                  <div className="mt-2 h-2 w-16 rounded-full bg-slate-100" />
                </div>
              </div>
              <div className="hidden h-8 w-24 rounded-full bg-[#eef5ff] sm:block" />
            </div>

            <div className="grid gap-5 pt-5 md:grid-cols-[1fr_220px]">
              <div className="space-y-4">
                <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                <div className="h-3 w-full rounded-full bg-slate-100" />
                <div className="h-3 w-5/6 rounded-full bg-slate-100" />

                <div className="relative mt-8 rounded-2xl border-2 border-dashed border-[#2f6fed] bg-[#f4f8ff] p-4">
                  <div className="absolute -top-7 left-4 rounded-full bg-[#2f6fed] px-3 py-1.5 font-mono text-xs font-semibold text-white shadow-md">
                    button.checkoutCta
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="h-3 w-28 rounded-full bg-slate-300" />
                      <div className="mt-2 h-2 w-36 rounded-full bg-slate-200" />
                    </div>
                    <div className="rounded-full bg-[#f36b6d] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(243,107,109,0.24)]">
                      Start trial
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  ["Revenue", "$18.4k"],
                  ["Seats", "42"],
                  ["Plan", "Pro"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 p-2 shadow-[0_14px_40px_rgba(48,67,93,0.18)] backdrop-blur">
            <button className="grid size-10 place-items-center rounded-full bg-[#2f6fed] text-white">
              <MousePointer2 className="size-4" />
            </button>
            <button className="grid size-10 place-items-center rounded-full text-slate-400">
              <Copy className="size-4" />
            </button>
            <button className="grid size-10 place-items-center rounded-full text-slate-400">
              <Palette className="size-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="rounded-2xl border border-slate-200 bg-[#fffdf9] p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <PenLine className="size-4 text-[#f36b6d]" />
              Add feedback
            </div>
            <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-700">
              Make the trial button a little smaller and use our softer coral action color.
            </p>
            <div className="mt-4 flex justify-end">
              <span className="rounded-full bg-[#f36b6d] px-4 py-2 text-xs font-semibold text-white">
                Add note
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Captured context
            </p>
            <div className="space-y-3 text-sm">
              <ContextLine icon={FileCode2} label="File" value="src/components/PricingCTA.tsx:68" />
              <ContextLine icon={ScanLine} label="Selector" value="button.checkoutCta" />
              <ContextLine icon={Braces} label="Styles" value="height, padding, color, radius" />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Check className="size-4 text-[#2bbf78]" />
              Prompt ready
            </div>
            <div className="mt-3 space-y-2 font-mono text-[11px] leading-5 text-slate-500">
              <p>Fix only the selected button.</p>
              <p>File: src/components/PricingCTA.tsx:68</p>
              <p>Feedback: make smaller, softer coral color.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileCode2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-7 place-items-center rounded-lg bg-white text-[#2f6fed] ring-1 ring-slate-200">
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate font-mono text-xs text-slate-700">{value}</p>
      </div>
    </div>
  );
}
