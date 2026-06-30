import { NextResponse } from "next/server";
import { annotationSchema } from "@elementation/core";
import { createAnnotation, listAnnotations } from "@/server/annotations-repo";

export async function GET(request: Request) {
  const projectKey = new URL(request.url).searchParams.get("projectKey") ?? undefined;
  return NextResponse.json(await listAnnotations(projectKey));
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = annotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid annotation payload" }, { status: 400 });
  }
  const annotation = await createAnnotation(parsed.data);
  return NextResponse.json(annotation, { status: 201 });
}
