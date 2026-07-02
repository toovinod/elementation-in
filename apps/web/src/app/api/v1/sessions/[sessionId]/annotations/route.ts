import { NextResponse } from "next/server";
import { annotationSchema } from "@elementation/core";
import { createSyncedAnnotation, listSyncedAnnotations } from "@/server/annotations-repo";
import { emitEvent } from "@/server/emit-event";
import { getSession } from "@/server/sessions-repo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  return NextResponse.json(await listSyncedAnnotations(sessionId));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = annotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid annotation payload" }, { status: 400 });
  }

  const projectKey = parsed.data.projectKey ?? parsed.data.capture.projectKey ?? session.projectKey;
  const annotation = await createSyncedAnnotation({
    ...parsed.data,
    sessionId,
    projectKey,
    capture: { ...parsed.data.capture, projectKey },
  });
  await emitEvent({
    type: "annotation.created",
    sessionId,
    projectKey,
    payload: annotation,
  });
  await emitEvent({
    type: "prompt.generated",
    sessionId,
    projectKey,
    payload: {
      annotationId: annotation.id,
      generatedPrompt: annotation.generatedPrompt,
    },
  });
  return NextResponse.json(annotation, { status: 201 });
}
