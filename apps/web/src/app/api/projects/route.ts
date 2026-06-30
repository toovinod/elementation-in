import { NextResponse } from "next/server";
import { z } from "zod";
import { createProject, listProjects } from "@/server/projects-repo";

export async function GET() {
  return NextResponse.json(await listProjects());
}

const createProjectSchema = z.object({
  name: z.string().min(1),
  key: z.string().optional(),
});

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
  }
  const project = await createProject(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
