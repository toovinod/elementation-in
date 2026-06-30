import { elementationCaptureSchema, type ElementationAnnotation } from "@elementation/core";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

interface AnnotationRow {
  id: string;
  projectKey: string;
  capture: Prisma.JsonValue;
  generatedPrompt: string;
  createdAt: Date;
}

function toAnnotation(row: AnnotationRow): ElementationAnnotation {
  return {
    id: row.id,
    projectKey: row.projectKey || undefined,
    capture: elementationCaptureSchema.parse(row.capture),
    generatedPrompt: row.generatedPrompt,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listAnnotations(projectKey?: string): Promise<ElementationAnnotation[]> {
  const rows = await prisma.annotation.findMany({
    where: projectKey ? { projectKey } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toAnnotation);
}

export async function createAnnotation(
  input: ElementationAnnotation,
): Promise<ElementationAnnotation> {
  const row = await prisma.annotation.create({
    data: {
      id: input.id,
      projectKey: input.projectKey ?? "",
      feedback: input.capture.feedback,
      capture: input.capture as unknown as Prisma.InputJsonValue,
      generatedPrompt: input.generatedPrompt,
    },
  });
  return toAnnotation(row);
}

export async function deleteAnnotation(id: string): Promise<void> {
  await prisma.annotation.delete({ where: { id } }).catch(() => undefined);
}
