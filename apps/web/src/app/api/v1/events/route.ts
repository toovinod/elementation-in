import { createEventStream } from "@/server/sse";

export async function GET(request: Request) {
  const projectKey = new URL(request.url).searchParams.get("projectKey") ?? undefined;
  return createEventStream(request, { projectKey });
}
