import { NextResponse } from "next/server";
import { listPendingAnnotations } from "@/server/annotations-repo";

export async function GET() {
  return NextResponse.json(await listPendingAnnotations());
}
