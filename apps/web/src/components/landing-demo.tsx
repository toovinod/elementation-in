"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  Copy,
  Eye,
  Frame,
  Map as MapIcon,
  Pause,
  PieChart,
  Scan,
  Search,
  Settings,
  Settings2,
  SquareTerminal,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";

type Rect = { left: number; top: number; width: number; height: number };

const STEPS = [
  { title: "Acme Inc", feedback: "Rename to Linear Inc" },
  { title: "Metrics card", feedback: "Change to primary style" },
  { title: "Sidebar items", feedback: "Add cursor-pointer" },
];

const platformNav = [
  { icon: SquareTerminal, label: "Playground", open: false },
  { icon: Bot, label: "Models" },
  { icon: Search, label: "Documentation" },
  { icon: Settings2, label: "Settings" },
];

const projectsNav = [
  { icon: Frame, label: "Design Engineering" },
  { icon: PieChart, label: "Sales & Marketing" },
  { icon: MapIcon, label: "Travel" },
];

const POP_W = 224;
const POP_H = 116;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function LandingDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const inspectRef = useRef<HTMLButtonElement>(null);

  const [rects, setRects] = useState<(Rect | null)[]>([null, null, null]);
  const [inspectRect, setInspectRect] = useState<Rect | null>(null);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });

  // stage 0 = click inspect (intro); 1..3 = annotate STEPS[stage-1]
  const [stage, setStage] = useState(0);
  const [typed, setTyped] = useState("");
  const [pressed, setPressed] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const base = stage.getBoundingClientRect();
    setStageSize({ w: base.width, h: base.height });
    const toRect = (el: Element | null): Rect | null => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { left: b.left - base.left, top: b.top - base.top, width: b.width, height: b.height };
    };
    setRects([toRect(teamRef.current), toRect(boxRef.current), toRect(navRef.current)]);
    const ir = toRect(inspectRef.current);
    if (ir) setInspectRect(ir);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    const settle = window.setTimeout(measure, 350);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(settle);
    };
  }, [measure]);

  useEffect(() => {
    if (reduced) {
      if (stage !== 1) {
        setStage(1);
      } else {
        setTyped(STEPS[0]?.feedback ?? "");
        setPopoverOpen(true);
      }
      return;
    }

    if (stage === 0) {
      setTyped("");
      setPressed(false);
      setPopoverOpen(false);
      const press = window.setTimeout(() => setPressed(true), 780);
      const release = window.setTimeout(() => setPressed(false), 1050);
      const next = window.setTimeout(() => setStage(1), 1550);
      return () => {
        window.clearTimeout(press);
        window.clearTimeout(release);
        window.clearTimeout(next);
      };
    }

    const step = STEPS[stage - 1];
    if (!step) return;
    setTyped("");
    setPopoverOpen(false);
    let i = 0;
    let typer: ReturnType<typeof setInterval> | undefined;
    const openPop = window.setTimeout(() => setPopoverOpen(true), 660);
    const start = window.setTimeout(() => {
      typer = setInterval(() => {
        i += 1;
        setTyped(step.feedback.slice(0, i));
        if (i >= step.feedback.length && typer) clearInterval(typer);
      }, 55);
    }, 940);
    const advance = window.setTimeout(
      () => setStage(stage === 3 ? 0 : stage + 1),
      940 + step.feedback.length * 55 + 1600,
    );
    return () => {
      window.clearTimeout(openPop);
      window.clearTimeout(start);
      if (typer) clearInterval(typer);
      window.clearTimeout(advance);
    };
  }, [stage, reduced]);

  const activeIndex = stage >= 1 ? stage - 1 : -1;
  const activeRect = activeIndex >= 0 ? rects[activeIndex] : null;
  const activeStep = activeIndex >= 0 ? STEPS[activeIndex] : null;

  const cursor =
    stage === 0 && inspectRect
      ? {
          left: inspectRect.left + inspectRect.width * 0.5,
          top: inspectRect.top + inspectRect.height * 0.5,
        }
      : activeRect
        ? {
            left: activeRect.left + activeRect.width * 0.5,
            top: activeRect.top + activeRect.height * 0.62,
          }
        : null;

  const popover = activeRect ? placePopover(activeRect, stageSize) : null;

  return (
    <div className="relative mt-14 w-full">
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-[0_30px_90px_-30px_rgba(40,30,18,0.45)]">
        <div className="border-border bg-secondary/60 flex items-center gap-2 border-b px-4 py-3">
          <span className="bg-primary/70 size-2.5 rounded-full" />
          <span className="bg-highlight size-2.5 rounded-full" />
          <span className="bg-border size-2.5 rounded-full" />
          <span className="text-muted-foreground ml-3 font-mono text-[11px]">localhost:3000</span>
        </div>

        <div className="overflow-x-auto">
          <div ref={stageRef} className="relative min-w-[720px] bg-white">
            <div className="flex h-[430px] text-zinc-900">
              {/* Sidebar */}
              <div className="flex w-[232px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/80">
                <div className="p-2">
                  <button
                    ref={teamRef}
                    className="flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-zinc-100"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-zinc-900 text-white">
                      <Command className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-sm font-semibold">Acme Inc</span>
                      <span className="block truncate text-xs text-zinc-500">Enterprise</span>
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 text-zinc-400" />
                  </button>
                </div>

                <div className="px-2 py-1">
                  <p className="px-2 py-1.5 text-[11px] font-medium text-zinc-400">Platform</p>
                  <ul ref={navRef} className="space-y-0.5">
                    {platformNav.map((item, i) => (
                      <li key={item.label}>
                        <span
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                            i === 0 ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-600"
                          }`}
                        >
                          <item.icon className="size-4 shrink-0 text-zinc-500" />
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight
                            className={`size-3.5 text-zinc-400 ${item.open ? "rotate-90" : ""}`}
                          />
                        </span>
                        {item.open ? (
                          <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-zinc-200 pl-2.5">
                            {["History", "Starred", "Settings"].map((sub) => (
                              <li
                                key={sub}
                                className="rounded-md px-2 py-1 text-[13px] text-zinc-500 hover:bg-zinc-100"
                              >
                                {sub}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-2 py-1">
                  <p className="px-2 py-1.5 text-[11px] font-medium text-zinc-400">Projects</p>
                  <ul className="space-y-0.5">
                    {projectsNav.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-600"
                      >
                        <item.icon className="size-4 shrink-0 text-zinc-500" />
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-zinc-200 p-2">
                  <div className="flex items-center gap-2 rounded-md p-1.5">
                    <span className="from-primary to-brand-400 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold text-white">
                      SC
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-sm font-medium">shadcn</span>
                      <span className="block truncate text-xs text-zinc-500">m@example.com</span>
                    </span>
                    <ChevronsUpDown className="size-4 shrink-0 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Main */}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 text-sm text-zinc-500">
                  <span className="grid size-7 place-items-center rounded-md hover:bg-zinc-100">
                    <span className="flex flex-col gap-[3px]">
                      <span className="h-0.5 w-3.5 rounded bg-zinc-400" />
                      <span className="h-0.5 w-3.5 rounded bg-zinc-400" />
                    </span>
                  </span>
                  <span className="h-4 w-px bg-zinc-200" />
                  <span>Building Your Application</span>
                  <ChevronRight className="size-3.5 text-zinc-300" />
                  <span className="text-zinc-900">Data Fetching</span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      ref={boxRef}
                      className="aspect-video rounded-xl border border-zinc-200 bg-zinc-100/70"
                    />
                    <div className="aspect-video rounded-xl border border-zinc-200 bg-zinc-100/70" />
                    <div className="aspect-video rounded-xl border border-zinc-200 bg-zinc-100/70" />
                  </div>
                  <div className="mt-4 min-h-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-100/70" />
                </div>
              </div>
            </div>

            {/* Selection + pins + popover (annotation stages) */}
            {activeRect && activeStep ? (
              <>
                <div
                  className="border-primary pointer-events-none absolute z-20 rounded-[6px] border-2 transition-all duration-500 ease-out"
                  style={{
                    left: activeRect.left - 4,
                    top: activeRect.top - 4,
                    width: activeRect.width + 8,
                    height: activeRect.height + 8,
                  }}
                >
                  {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                    <span
                      key={corner}
                      className="border-primary absolute size-2 rounded-[2px] border-2 bg-white"
                      style={handleStyle(corner)}
                    />
                  ))}
                </div>

                {rects.map((r, i) =>
                  r ? (
                    <span
                      key={i}
                      className={`pin-pop bg-primary absolute z-20 grid size-6 place-items-center text-[11px] font-semibold text-white shadow-[0_6px_16px_rgba(106,75,255,0.4)] ${
                        i === activeIndex && !reduced ? "pin-pulse" : ""
                      }`}
                      style={{
                        left: r.left + r.width - 12,
                        top: r.top - 12,
                        borderRadius: "50% 50% 50% 4px",
                        animationDelay: `${i * 160}ms`,
                      }}
                    >
                      {i + 1}
                    </span>
                  ) : null,
                )}

                {popover && popoverOpen ? (
                  <div
                    className="el-pop-in bg-foreground text-background absolute z-30 w-[224px] rounded-xl border border-white/10 p-3.5 shadow-2xl"
                    style={{ left: popover.left, top: popover.top }}
                  >
                    <p className="text-background/50 font-mono text-[10px] uppercase tracking-wider">
                      {activeStep.title}
                    </p>
                    <div className="mt-1.5 min-h-[34px] text-[13px] leading-snug">
                      {typed}
                      {!reduced ? (
                        <span className="bg-background/70 ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse" />
                      ) : null}
                    </div>
                    <div className="mt-2.5 flex items-center justify-end gap-3">
                      <span className="text-background/55 text-[11px]">Cancel</span>
                      <span className="bg-primary rounded-md px-2.5 py-1 text-[11px] font-medium text-white">
                        Add
                      </span>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {/* Intro shows the Inspect trigger the cursor clicks; then the control bar opens */}
            {stage === 0 && !reduced ? (
              <div className="border-border bg-card/95 absolute bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border p-1.5 pr-3 shadow-[0_14px_40px_rgba(40,30,18,0.18)] backdrop-blur">
                <button
                  ref={inspectRef}
                  className={`pin-pulse bg-primary grid size-9 place-items-center rounded-full text-white transition-transform duration-150 ${
                    pressed ? "scale-90" : ""
                  }`}
                >
                  <Scan className="size-4" />
                </button>
                <span className="text-foreground text-xs font-medium">Inspect</span>
              </div>
            ) : (
              <div className="el-pop-in bg-foreground absolute bottom-4 right-4 z-40 flex items-center gap-0.5 rounded-full px-2 py-1.5 shadow-[0_14px_40px_rgba(24,20,16,0.32)]">
                <ToolbarBtn icon={Pause} label="Pause" />
                <ToolbarBtn icon={Eye} label="Preview" />
                <ToolbarBtn icon={Copy} label="Copy prompt" />
                <ToolbarBtn icon={Trash2} label="Delete" />
                <ToolbarBtn icon={Settings} label="Settings" />
                <span className="mx-1 h-4 w-px bg-white/15" />
                <ToolbarBtn icon={X} label="Close" />
              </div>
            )}

            {/* Animated cursor */}
            {cursor && !reduced ? (
              <span
                className="pointer-events-none absolute z-50 -ml-1 -mt-1 transition-all duration-[600ms] ease-out"
                style={{ left: cursor.left, top: cursor.top }}
              >
                <svg viewBox="0 0 24 24" className="size-5 drop-shadow" aria-hidden="true">
                  <path
                    d="M5 3l14 7-6 1.5L10 18 5 3z"
                    fill="#181410"
                    stroke="#fff"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-primary w-5" : "bg-border w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function placePopover(rect: Rect, stage: { w: number; h: number }) {
  const gap = 14;
  let left: number;
  if (rect.left + rect.width + gap + POP_W <= stage.w) {
    left = rect.left + rect.width + gap;
  } else if (rect.left - gap - POP_W >= 0) {
    left = rect.left - gap - POP_W;
  } else {
    left = Math.min(Math.max(rect.left, 8), Math.max(stage.w - POP_W - 8, 8));
  }
  let top = rect.top + rect.height / 2 - POP_H / 2;
  top = Math.min(Math.max(top, 12), Math.max(stage.h - POP_H - 12, 12));
  return { left, top };
}

function handleStyle(corner: "tl" | "tr" | "bl" | "br"): CSSProperties {
  const map: Record<string, CSSProperties> = {
    tl: { left: -5, top: -5 },
    tr: { right: -5, top: -5 },
    bl: { left: -5, bottom: -5 },
    br: { right: -5, bottom: -5 },
  };
  return map[corner] ?? {};
}

function ToolbarBtn({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="text-background/70 hover:text-background grid size-7 place-items-center rounded-full transition-colors hover:bg-white/10"
    >
      <Icon className="size-4" />
    </button>
  );
}
