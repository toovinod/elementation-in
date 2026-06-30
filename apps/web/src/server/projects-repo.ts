import { createProjectKey, type ElementationProject } from "@elementation/core";
import { prisma } from "@/lib/db";

interface ProjectRow {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
}

function toProject(row: ProjectRow): ElementationProject {
  return { id: row.id, name: row.name, key: row.key, createdAt: row.createdAt.toISOString() };
}

export async function listProjects(): Promise<ElementationProject[]> {
  const rows = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toProject);
}

export async function getProject(idOrKey: string): Promise<ElementationProject | null> {
  const row = await prisma.project.findFirst({
    where: { OR: [{ id: idOrKey }, { key: idOrKey }] },
  });
  return row ? toProject(row) : null;
}

export async function createProject(input: {
  name: string;
  key?: string;
}): Promise<ElementationProject> {
  const row = await prisma.project.create({
    data: { name: input.name, key: input.key ?? createProjectKey() },
  });
  return toProject(row);
}

export async function ensureProject(key: string, name: string): Promise<ElementationProject> {
  const row = await prisma.project.upsert({
    where: { key },
    update: {},
    create: { key, name },
  });
  return toProject(row);
}
