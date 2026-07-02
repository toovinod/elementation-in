import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, updateSession } from "@/server/sessions-repo";
import { emitEvent } from "@/server/emit-event";

const updateSessionSchema = z.object({
  status: z.enum(["active", "closed", "approved"]).optional(),
  url: z.string().optional(),
  pathname: z.string().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  return NextResponse.json(session);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const parsed = updateSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session update" }, { status: 400 });
  }

  const session = await updateSession(sessionId, parsed.data);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  await emitEvent({
    type: session.status === "closed" ? "session.closed" : "session.updated",
    sessionId: session.id,
    projectKey: session.projectKey,
    payload: session,
  });
  return NextResponse.json(session);
}
