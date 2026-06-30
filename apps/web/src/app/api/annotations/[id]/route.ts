import { NextResponse } from "next/server";
import { deleteAnnotation } from "@/server/annotations-repo";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteAnnotation(id);
  return new NextResponse(null, { status: 204 });
}
