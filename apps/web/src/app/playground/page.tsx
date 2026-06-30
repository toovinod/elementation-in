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
      <div className="mb-7 border-b border-slate-200 pb-7">
        <p className="text-sm font-semibold text-[#f36b6d]">Playground</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Try the inspect flow
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Click the bottom-right Inspect icon, hover an element, click it, write feedback, and copy
          the generated prompt.
        </p>
      </div>
      <PlaygroundSurface projectKey={project.key} />
    </AppShell>
  );
}
