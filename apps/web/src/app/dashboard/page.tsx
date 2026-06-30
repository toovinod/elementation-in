import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectList } from "@/components/project-list";
import { listProjects } from "@/server/projects-repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Elementation projects and annotations.",
};

export default async function DashboardPage() {
  const projects = await listProjects();

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <p className="text-sm font-semibold text-[#f36b6d]">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Projects</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Create a project, install the overlay, and collect UI feedback as precise AI prompts.
          </p>
        </div>
        <CreateProjectDialog />
      </div>
      <div className="mt-8">
        <ProjectList projects={projects} />
      </div>
    </AppShell>
  );
}
