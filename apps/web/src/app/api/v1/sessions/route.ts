import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, listSessions } from "@/server/sessions-repo";
import { emitEvent } from "@/server/emit-event";

const createSessionSchema = z.object({
  id: z.string().optional(),
  projectKey: z.string().optional(),
  name: z.string().optional(),
  url: z.string().optional(),
  pathname: z.string().optional(),
  userAgent: z.string().optional(),
});

export async function GET() {
  return NextResponse.json(await listSessions());
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = createSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session payload" }, { status: 400 });
  }

  const session = await createSession(parsed.data);
  await emitEvent({
    type: "session.created",
    sessionId: session.id,
    projectKey: session.projectKey,
    payload: session,
  });
  return NextResponse.json(session, { status: 201 });
}
