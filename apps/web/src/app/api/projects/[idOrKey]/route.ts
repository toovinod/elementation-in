import { NextResponse } from "next/server";
import { getProject } from "@/server/projects-repo";

export async function GET(_request: Request, { params }: { params: Promise<{ idOrKey: string }> }) {
  const { idOrKey } = await params;
  return NextResponse.json(await getProject(idOrKey));
}
