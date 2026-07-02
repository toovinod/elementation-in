import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { PlaygroundSurface } from "@/components/playground/playground-surface";
import { ensureProject } from "@/server/projects-repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Playground",
  description: "Try the Elementation overlay on a realistic sample UI.",
};

export default async function PlaygroundPage() {
  const project = await ensureProject("el_playground", "Playground");

  return (
    <AppShell>
      <div className="border-border mb-7 border-b pb-7">
        <span className="text-primary inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.18em]">
          <span className="bg-primary size-1.5 rounded-[2px]" />
          Playground
        </span>
        <h1 className="text-foreground mt-3 text-3xl font-medium tracking-tight">
          Try the inspect flow
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
          Click the bottom-right Inspect icon, hover an element, click it, write feedback, and copy
          the generated prompt.
        </p>
      </div>
      <PlaygroundSurface projectKey={project.key} />
    </AppShell>
  );
}
