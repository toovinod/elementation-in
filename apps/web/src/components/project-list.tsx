import Link from "next/link";
import { ArrowRight, FolderPlus } from "lucide-react";
import type { ElementationProject } from "@elementation/core";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectList({ projects }: { projects: ElementationProject[] }) {
  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 px-6 py-14 text-center">
          <span className="bg-muted text-muted-foreground grid size-10 place-items-center rounded-lg">
            <FolderPlus className="size-5" />
          </span>
          <p className="font-medium">No projects yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Create your first project to get an install key, or open the playground to try the
            overlay without installing anything.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Card className="hover:border-primary/40 h-full transition-colors">
            <CardContent className="p-5">
              <div className="font-medium">{project.name}</div>
              <code className="text-muted-foreground mt-1 block truncate text-xs">
                {project.key}
              </code>
              <div className="text-primary mt-6 flex items-center text-sm font-medium">
                Open project <ArrowRight className="ml-1 size-3.5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
