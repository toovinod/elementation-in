import { NextResponse } from "next/server";
import { listPendingAnnotations } from "@/server/annotations-repo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  return NextResponse.json(await listPendingAnnotations(sessionId));
}
