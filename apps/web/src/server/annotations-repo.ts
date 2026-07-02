import {
  annotationStatusSchema,
  elementationCaptureSchema,
  syncedAnnotationSchema,
  type AnnotationLifecycleUpdate,
  type ElementationAnnotation,
  type SyncedElementationAnnotation,
  type ThreadMessage,
} from "@elementation/core";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

interface AnnotationRow {
  id: string;
  sessionId?: string | null;
  projectKey: string;
  capture: Prisma.JsonValue;
  generatedPrompt: string;
  status?: string;
  acknowledgedAt?: Date | null;
  resolvedAt?: Date | null;
  resolvedBy?: string | null;
  dismissedAt?: Date | null;
  dismissedReason?: string | null;
  updatedAt?: Date;
  createdAt: Date;
  threadMessages?: ThreadMessageRow[];
}

interface ThreadMessageRow {
  id: string;
  annotationId: string;
  role: string;
  message: string;
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

function toThreadMessage(row: ThreadMessageRow): ThreadMessage {
  return {
    id: row.id,
    annotationId: row.annotationId,
    role: row.role === "agent" || row.role === "system" ? row.role : "human",
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  };
}

function toSyncedAnnotation(row: AnnotationRow): SyncedElementationAnnotation {
  return syncedAnnotationSchema.parse({
    ...toAnnotation(row),
    sessionId: row.sessionId ?? undefined,
    status: annotationStatusSchema.catch("pending").parse(row.status),
    acknowledgedAt: row.acknowledgedAt?.toISOString(),
    resolvedAt: row.resolvedAt?.toISOString(),
    resolvedBy:
      row.resolvedBy === "human" || row.resolvedBy === "agent" ? row.resolvedBy : undefined,
    dismissedAt: row.dismissedAt?.toISOString(),
    dismissedReason: row.dismissedReason ?? undefined,
    thread: row.threadMessages?.map(toThreadMessage) ?? [],
    updatedAt: (row.updatedAt ?? row.createdAt).toISOString(),
  });
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

export async function getSyncedAnnotation(
  id: string,
): Promise<SyncedElementationAnnotation | null> {
  const row = await prisma.annotation.findUnique({
    where: { id },
    include: { threadMessages: { orderBy: { createdAt: "asc" } } },
  });
  return row ? toSyncedAnnotation(row) : null;
}

export async function listSyncedAnnotations(
  sessionId?: string,
): Promise<SyncedElementationAnnotation[]> {
  const rows = await prisma.annotation.findMany({
    where: sessionId ? { sessionId } : undefined,
    include: { threadMessages: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSyncedAnnotation);
}

export async function listPendingAnnotations(
  sessionId?: string,
): Promise<SyncedElementationAnnotation[]> {
  const rows = await prisma.annotation.findMany({
    where: { status: { in: ["pending", "acknowledged"] }, ...(sessionId ? { sessionId } : {}) },
    include: { threadMessages: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toSyncedAnnotation);
}

export async function createSyncedAnnotation(
  input: ElementationAnnotation & { sessionId?: string },
): Promise<SyncedElementationAnnotation> {
  const row = await prisma.annotation.create({
    data: {
      id: input.id,
      sessionId: input.sessionId,
      projectKey: input.projectKey ?? "",
      feedback: input.capture.feedback,
      capture: input.capture as unknown as Prisma.InputJsonValue,
      generatedPrompt: input.generatedPrompt,
      status: "pending",
    },
    include: { threadMessages: true },
  });
  return toSyncedAnnotation(row);
}

export async function updateSyncedAnnotation(
  id: string,
  input: AnnotationLifecycleUpdate,
): Promise<SyncedElementationAnnotation | null> {
  const row = await prisma.annotation
    .update({
      where: { id },
      data: {
        ...(input.feedback !== undefined ? { feedback: input.feedback } : {}),
        ...(input.generatedPrompt !== undefined ? { generatedPrompt: input.generatedPrompt } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.acknowledgedAt !== undefined
          ? { acknowledgedAt: new Date(input.acknowledgedAt) }
          : {}),
        ...(input.resolvedAt !== undefined ? { resolvedAt: new Date(input.resolvedAt) } : {}),
        ...(input.resolvedBy !== undefined ? { resolvedBy: input.resolvedBy } : {}),
        ...(input.dismissedAt !== undefined ? { dismissedAt: new Date(input.dismissedAt) } : {}),
        ...(input.dismissedReason !== undefined ? { dismissedReason: input.dismissedReason } : {}),
      },
      include: { threadMessages: { orderBy: { createdAt: "asc" } } },
    })
    .catch(() => null);
  return row ? toSyncedAnnotation(row) : null;
}

export async function deleteSyncedAnnotation(
  id: string,
): Promise<SyncedElementationAnnotation | null> {
  const existing = await getSyncedAnnotation(id);
  if (!existing) return null;
  await prisma.annotation.delete({ where: { id } });
  return existing;
}

export async function createThreadMessage(input: {
  id?: string;
  annotationId: string;
  role: "human" | "agent" | "system";
  message: string;
}): Promise<ThreadMessage> {
  const row = await prisma.threadMessage.create({
    data: {
      ...(input.id ? { id: input.id } : {}),
      annotationId: input.annotationId,
      role: input.role,
      message: input.message,
    },
  });
  return toThreadMessage(row);
}
