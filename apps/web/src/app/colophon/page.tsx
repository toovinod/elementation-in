import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How Elementation is built.",
};

const details = [
  { label: "Framework", value: "Next.js 16 App Router and React 19" },
  { label: "Language", value: "TypeScript in strict mode" },
  { label: "Styling", value: "Tailwind CSS v4 with a light-only Inter design system" },
  { label: "Monorepo", value: "Turborepo and pnpm workspaces" },
  { label: "Data", value: "Prisma with SQLite for local development" },
  { label: "Typeface", value: "Inter" },
];

export default function ColophonPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-[#f36b6d]">Colophon</p>
        <h1 className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-slate-950">
          Built for visual feedback.
        </h1>
        <p className="mt-3 leading-7 text-slate-600">
          Elementation is built as a Next.js app plus a React overlay SDK. The product is designed
          to feel practical, exact, and easy to scan.
        </p>
        <dl className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {details.map((detail) => (
            <div key={detail.label} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
              <dt className="text-sm font-semibold text-slate-950">{detail.label}</dt>
              <dd className="text-slate-600">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AppShell>
  );
}
