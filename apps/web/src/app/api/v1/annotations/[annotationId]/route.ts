import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteSyncedAnnotation,
  getSyncedAnnotation,
  updateSyncedAnnotation,
} from "@/server/annotations-repo";
import { emitEvent } from "@/server/emit-event";

const updateAnnotationSchema = z.object({
  status: z.enum(["pending", "acknowledged", "resolved", "dismissed"]).optional(),
  feedback: z.string().optional(),
  generatedPrompt: z.string().optional(),
  summary: z.string().optional(),
  reason: z.string().optional(),
});

function eventTypeForStatus(status: string | undefined): Parameters<typeof emitEvent>[0]["type"] {
  if (status === "acknowledged") return "annotation.acknowledged";
  if (status === "resolved") return "annotation.resolved";
  if (status === "dismissed") return "annotation.dismissed";
  return "annotation.updated";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ annotationId: string }> },
) {
  const { annotationId } = await params;
  const annotation = await getSyncedAnnotation(annotationId);
  if (!annotation) return NextResponse.json({ error: "Annotation not found" }, { status: 404 });
  return NextResponse.json(annotation);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ annotationId: string }> },
) {
  const { annotationId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const parsed = updateAnnotationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid annotation update" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const annotation = await updateSyncedAnnotation(annotationId, {
    status: parsed.data.status,
    feedback: parsed.data.feedback,
    generatedPrompt: parsed.data.generatedPrompt,
    acknowledgedAt: parsed.data.status === "acknowledged" ? now : undefined,
    resolvedAt: parsed.data.status === "resolved" ? now : undefined,
    resolvedBy: parsed.data.status === "resolved" ? "agent" : undefined,
    dismissedAt: parsed.data.status === "dismissed" ? now : undefined,
    dismissedReason: parsed.data.reason,
  });
  if (!annotation) return NextResponse.json({ error: "Annotation not found" }, { status: 404 });

  await emitEvent({
    type: eventTypeForStatus(parsed.data.status),
    sessionId: annotation.sessionId,
    projectKey: annotation.projectKey,
    payload: {
      ...annotation,
      summary: parsed.data.summary,
      reason: parsed.data.reason,
    },
  });
  return NextResponse.json(annotation);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ annotationId: string }> },
) {
  const { annotationId } = await params;
  const annotation = await deleteSyncedAnnotation(annotationId);
  if (!annotation) return NextResponse.json({ error: "Annotation not found" }, { status: 404 });
  await emitEvent({
    type: "annotation.deleted",
    sessionId: annotation.sessionId,
    projectKey: annotation.projectKey,
    payload: annotation,
  });
  return new NextResponse(null, { status: 204 });
}
