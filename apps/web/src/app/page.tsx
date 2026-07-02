import type { ReactNode } from "react";
import Link from "next/link";
import { LandingDemo } from "@/components/landing-demo";
import { MarketingShell } from "@/components/marketing-shell";
import { Reveal } from "@/components/reveal";

const workflow = [
  { lead: "Click", rest: " the Inspect control pinned to the bottom-right corner." },
  { lead: "Hover", rest: " the page to read the exact element name as you move." },
  { lead: "Select", rest: " the button, card, or text that needs a change." },
  { lead: "Write", rest: " plain feedback in the annotation popover." },
  { lead: "Copy", rest: " the formatted Markdown prompt it generates." },
  { lead: "Paste", rest: " it into Codex, Cursor, Claude Code, or any agent." },
];

const captures = [
  {
    term: "Source location",
    value: "HeroCTA.tsx:42",
    body: "The exact file and line your agent should open first.",
  },
  {
    term: "Element selector",
    value: "section.hero button.primary-cta",
    body: "A stable selector and the visible text, so the agent can grep for it.",
  },
  {
    term: "Computed styles",
    value: "padding · color · radius · font",
    body: "What the element actually looks like in the browser right now.",
  },
  {
    term: "Your feedback",
    value: "“make it smaller”",
    body: "Plain language, wrapped with precise implementation constraints.",
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      <div className="px-6 md:px-10 lg:px-14">
        <div className="max-w-184">
          <section className="pb-14 pt-12 lg:pt-16">
            <span className="text-primary decoration-highlight font-mono text-xs font-medium uppercase tracking-[0.18em] underline decoration-[3px] underline-offset-[6px]">
              Visual feedback for AI agents
            </span>
            <h1 className="font-display text-foreground mt-5 text-[2.5rem] font-medium leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Click{" "}
              <span className="marker">
                <span>the UI</span>
              </span>
              . Copy the <em className="font-medium italic">exact</em> AI prompt.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-[1.0625rem] leading-[1.7]">
              Elementation turns one visual click into the file, selector, styles, and your note so
              your coding agent edits the right code, not the wrong part of a large app.
            </p>

            <LandingDemo />
          </section>

          <Reveal>
            <section id="how" className="border-border border-t py-14">
              <SectionHead
                eyebrow="Workflow"
                title="How you use it"
                description="A short visual feedback loop, built for codebases too large to point an agent at by hand."
              />
              <ol className="mt-8 space-y-4">
                {workflow.map((step, index) => (
                  <li key={step.lead} className="flex items-baseline gap-5">
                    <span className="text-muted-foreground/50 w-4 shrink-0 font-mono text-sm tabular-nums">
                      {index + 1}
                    </span>
                    <span className="text-foreground text-[1.0625rem] leading-7">
                      <strong className="font-medium">{step.lead}</strong>
                      {step.rest}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section id="context" className="border-border border-t py-14">
              <SectionHead
                eyebrow="Context"
                title="The prompt knows where to edit"
                description="Every annotation carries enough structure for an agent to act with confidence."
              />
              <dl className="mt-8">
                {captures.map(({ term, value, body }) => (
                  <div key={term} className="border-border/70 border-t py-5">
                    <dt className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-display text-foreground text-lg font-medium">
                        {term}
                      </span>
                      <code className="text-primary/80 font-mono text-xs">{value}</code>
                    </dt>
                    <dd className="text-muted-foreground mt-1.5 text-[1.0625rem] leading-7">
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </Reveal>

          <footer className="border-border text-muted-foreground flex flex-col gap-3 border-t py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Elementation</span>
            <div className="flex items-center gap-5">
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link href="/changelog" className="hover:text-foreground transition-colors">
                Changelog
              </Link>
              <span className="font-mono text-xs">elementation.in</span>
            </div>
          </footer>
        </div>
      </div>
    </MarketingShell>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-primary font-mono text-xs font-medium uppercase tracking-[0.18em]">
      {children}
    </span>
  );
}

function SectionHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-foreground mt-3 text-[1.75rem] font-medium leading-tight tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-3 text-[1.0625rem] leading-[1.7]">{description}</p>
      ) : null}
    </div>
  );
}
