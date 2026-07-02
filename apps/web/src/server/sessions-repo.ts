import {
  createId,
  sessionSchema,
  type CreateSessionInput,
  type ElementationSession,
  type UpdateSessionInput,
} from "@elementation/core";
import { prisma } from "@/lib/db";

interface SessionRow {
  id: string;
  projectKey: string | null;
  name: string;
  url: string | null;
  pathname: string | null;
  userAgent: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

function toSession(row: SessionRow): ElementationSession {
  return sessionSchema.parse({
    id: row.id,
    projectKey: row.projectKey ?? undefined,
    name: row.name,
    url: row.url ?? undefined,
    pathname: row.pathname ?? undefined,
    userAgent: row.userAgent ?? undefined,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

function nameFromInput(input: CreateSessionInput): string {
  if (input.name?.trim()) return input.name.trim();
  if (input.pathname?.trim()) return input.pathname.trim();
  if (input.url) {
    try {
      return new URL(input.url).pathname || input.url;
    } catch {
      return input.url;
    }
  }
  return "Elementation session";
}

export async function listSessions(): Promise<ElementationSession[]> {
  const rows = await prisma.session.findMany({ orderBy: { updatedAt: "desc" } });
  return rows.map(toSession);
}

export async function getSession(id: string): Promise<ElementationSession | null> {
  const row = await prisma.session.findUnique({ where: { id } });
  return row ? toSession(row) : null;
}

export async function createSession(input: CreateSessionInput): Promise<ElementationSession> {
  const row = await prisma.session.create({
    data: {
      id: input.id ?? createId(),
      projectKey: input.projectKey,
      name: nameFromInput(input),
      url: input.url,
      pathname: input.pathname,
      userAgent: input.userAgent,
      status: "active",
    },
  });
  return toSession(row);
}

export async function updateSession(
  id: string,
  input: UpdateSessionInput,
): Promise<ElementationSession | null> {
  const row = await prisma.session
    .update({
      where: { id },
      data: {
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.url !== undefined ? { url: input.url } : {}),
        ...(input.pathname !== undefined ? { pathname: input.pathname } : {}),
      },
    })
    .catch(() => null);
  return row ? toSession(row) : null;
}
