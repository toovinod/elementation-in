import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Copy,
  FileCode2,
  MousePointer2,
  PenLine,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { LandingDemo } from "@/components/landing-demo";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const workflow = [
  "Click the Inspect control in the bottom-right corner.",
  "Hover over the page to see the exact element name.",
  "Click the element that needs a design or copy change.",
  "Write the feedback in the annotation box.",
  "Copy the formatted Markdown prompt.",
  "Paste it into Codex, Cursor, Claude Code, or another coding agent.",
];

const contextRows = [
  {
    label: "Source location",
    value: "src/components/HeroCTA.tsx:42",
    body: "The file and line your agent should inspect first.",
    icon: FileCode2,
  },
  {
    label: "Element selector",
    value: "section.hero button.primary-cta",
    body: "A stable selector plus visible text for quick search.",
    icon: ScanLine,
  },
  {
    label: "Current styles",
    value: "padding, color, radius, font, size",
    body: "Computed styles that explain what the UI looks like now.",
    icon: Code2,
  },
  {
    label: "Your feedback",
    value: "Make this smaller and use the brand color",
    body: "Plain language wrapped with precise implementation constraints.",
    icon: PenLine,
  },
];

const overlaySnippet = `import { ElementationOverlay } from "@elementation/sdk";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ElementationOverlay projectKey="YOUR_PROJECT_KEY" />
        )}
      </body>
    </html>
  );
}`;

const promptSnippet = `Fix the selected UI element.

User feedback:
"Make this button smaller and use the primary brand color."

Target:
- Component: HeroCTA
- File: src/components/HeroCTA.tsx:42
- Selector: section.hero button.primary-cta
- Current styles: height 56px, padding 16px 28px

Constraints:
- Change only the selected element.
- Keep the click behavior and accessibility.
- Use an existing design token if one exists.`;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-slate-900">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-6 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-[#f4f8ff] px-3 py-1.5 text-sm font-medium text-[#2f6fed]">
              <MousePointer2 className="size-4" />
              Visual feedback for AI coding agents
            </div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-slate-950 sm:text-6xl md:text-7xl">
              Click the UI. Copy the exact AI prompt.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600">
              Elementation captures the selected element, source file, styles, and your note so your
              coding agent edits the right code.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#f36b6d] px-6 text-white hover:bg-[#e85f61]"
              >
                <Link href="/playground">
                  Try the playground <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-slate-200 bg-white px-6 text-slate-700 hover:bg-[#f4f8ff] hover:text-[#2f6fed]"
              >
                <Link href="/docs/quickstart">Read quickstart</Link>
              </Button>
            </div>
            <div className="mx-auto mt-6 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 font-mono text-sm text-slate-500 shadow-sm">
              pnpm add @elementation/sdk
            </div>
          </div>

          <LandingDemo />
        </section>

        <section id="how" className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[0.7fr_1fr]">
            <SectionTitle
              eyebrow="Workflow"
              title="How you use it"
              description="A short visual feedback loop designed for large codebases."
            />
            <ol className="space-y-4">
              {workflow.map((step, index) => (
                <li key={step} className="flex gap-4 text-lg leading-7">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f4f8ff] font-mono text-sm font-semibold text-[#2f6fed]">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="context" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionTitle
            eyebrow="Context"
            title="The prompt knows where to edit"
            description="Elementation turns one visual click into file, selector, style, and page context."
          />
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {contextRows.map(({ label, value, body, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#fff4f4] text-[#f36b6d]">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{label}</p>
                    <code className="mt-1 block font-mono text-xs text-slate-500">{value}</code>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="install" className="border-y border-slate-200 bg-[#f7fbff]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionTitle
                eyebrow="Install"
                title="Add one development-only overlay"
                description="Render the SDK once near the root of your app. It is isolated in Shadow DOM and stays out of production."
              />
              <div className="mt-8 space-y-4">
                {[
                  "Install @elementation/sdk.",
                  "Create a project key in the dashboard.",
                  "Render ElementationOverlay in development.",
                  "Open your app and start annotating.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2bbf78]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <CodeBlock code={overlaySnippet} language="tsx" />
          </div>
        </section>

        <section
          id="output"
          className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <SectionTitle
              eyebrow="Output"
              title="Copy clean Markdown into your agent"
              description="The generated prompt is specific enough to act on, but short enough to paste anywhere."
            />
            <div className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Copy className="size-4 text-[#f36b6d]" />
                Formatted Markdown, ready to paste.
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Sparkles className="size-4 text-[#2f6fed]" />
                Works with Codex, Cursor, Claude Code, and similar tools.
              </div>
            </div>
          </div>
          <CodeBlock code={promptSnippet} language="markdown" />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Try it on a real demo page.
              </h2>
              <p className="mt-2 text-slate-500">
                The playground already has the overlay installed, so you can test the full flow.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#2f6fed] px-6 text-white hover:bg-[#255fd7]"
            >
              <Link href="/playground">
                Open playground <MousePointer2 />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-[#f36b6d]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-3 leading-7 text-slate-500">{description}</p> : null}
    </div>
  );
}
