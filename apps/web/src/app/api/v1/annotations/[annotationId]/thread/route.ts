import { NextResponse } from "next/server";
import { z } from "zod";
import { createThreadMessage, getSyncedAnnotation } from "@/server/annotations-repo";
import { emitEvent } from "@/server/emit-event";

const createThreadMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["human", "agent", "system"]).default("agent"),
  message: z.string().min(1),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ annotationId: string }> },
) {
  const { annotationId } = await params;
  const annotation = await getSyncedAnnotation(annotationId);
  if (!annotation) return NextResponse.json({ error: "Annotation not found" }, { status: 404 });

  const body: unknown = await request.json().catch(() => null);
  const parsed = createThreadMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid thread message" }, { status: 400 });
  }

  const message = await createThreadMessage({
    ...parsed.data,
    annotationId,
  });
  await emitEvent({
    type: "thread.message.created",
    sessionId: annotation.sessionId,
    projectKey: annotation.projectKey,
    payload: message,
  });
  return NextResponse.json(message, { status: 201 });
}
