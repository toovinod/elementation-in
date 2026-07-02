import { createEventStream } from "@/server/sse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;
  return createEventStream(request, { sessionId });
}
