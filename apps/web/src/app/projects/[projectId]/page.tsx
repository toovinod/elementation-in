import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AnnotationList } from "@/components/annotation-list";
import { CopyButton } from "@/components/copy-button";
import { InstallSnippet } from "@/components/install-snippet";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listAnnotations } from "@/server/annotations-repo";
import { getProject } from "@/server/projects-repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project",
};

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  const annotations = await listAnnotations(project.key);

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
            <span>Project key</span>
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5">{project.key}</code>
            <CopyButton value={project.key} label="Copy" variant="ghost" size="sm" />
          </div>
        </div>
        <Badge variant="muted">
          {annotations.length} {annotations.length === 1 ? "annotation" : "annotations"}
        </Badge>
      </div>

      <Tabs defaultValue="annotations" className="mt-8">
        <TabsList>
          <TabsTrigger value="annotations">Annotations</TabsTrigger>
          <TabsTrigger value="install">Install</TabsTrigger>
        </TabsList>
        <TabsContent value="annotations" className="mt-4">
          <AnnotationList annotations={annotations} />
        </TabsContent>
        <TabsContent value="install" className="mt-4">
          <InstallSnippet projectKey={project.key} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
