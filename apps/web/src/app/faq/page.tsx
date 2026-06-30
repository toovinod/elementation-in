import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Elementation.",
};

const faqs = [
  {
    q: "Does Elementation modify my app?",
    a: "No. The overlay reads the DOM, captures metadata, and renders its own UI inside Shadow DOM.",
  },
  {
    q: "Do I need to install anything to try it?",
    a: "No. The playground has the overlay already installed on a sample UI.",
  },
  {
    q: "Where are annotations stored?",
    a: "With apiUrl, annotations sync to your dashboard. Without apiUrl, they stay in localStorage.",
  },
  {
    q: "How does it know the source file?",
    a: "It reads data-elementation-* attributes when available and falls back to best-effort React metadata.",
  },
  {
    q: "Which AI agents does it work with?",
    a: "Any tool that accepts Markdown prompts, including Codex, Cursor, and Claude Code.",
  },
];

export default function FaqPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-[#f36b6d]">FAQ</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-slate-950">
          Questions, answered.
        </h1>
        <dl className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-6">
              <dt className="font-semibold text-slate-950">{faq.q}</dt>
              <dd className="mt-2 leading-7 text-slate-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AppShell>
  );
}
