import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Notable changes to Elementation.",
};

const releases = [
  {
    version: "0.1.0",
    date: "June 30, 2026",
    tag: "MVP",
    changes: [
      "Overlay SDK with Shadow DOM isolation, inspect mode, hover/select highlighting, and the capture pipeline.",
      "Prompt engine that produces structured, AI-ready prompts with task, constraints, and acceptance criteria.",
      "Source mapping via data-elementation-* attributes with a best-effort React fiber fallback.",
      "Dashboard with projects and annotations, plus a live playground.",
      "REST API backed by Prisma + SQLite, architected to move to Postgres.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
        <p className="text-muted-foreground mt-2">Notable changes to Elementation.</p>
        <div className="mt-10 space-y-10">
          {releases.map((release) => (
            <div key={release.version} className="border-l pl-6">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">v{release.version}</h2>
                <Badge variant="muted">{release.tag}</Badge>
                <span className="text-muted-foreground text-sm">{release.date}</span>
              </div>
              <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm">
                {release.changes.map((change) => (
                  <li key={change}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
