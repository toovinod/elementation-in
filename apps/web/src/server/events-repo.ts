import {
  createId,
  elementationEventSchema,
  eventTypeSchema,
  type CreateEventInput,
  type ElementationEvent,
  type ListEventsOptions,
} from "@elementation/core";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

interface EventRow {
  id: string;
  type: string;
  sessionId: string | null;
  projectKey: string | null;
  sequence: number;
  payload: Prisma.JsonValue;
  createdAt: Date;
}

function toEvent(row: EventRow): ElementationEvent {
  return elementationEventSchema.parse({
    id: row.id,
    type: eventTypeSchema.parse(row.type),
    sessionId: row.sessionId ?? undefined,
    projectKey: row.projectKey ?? undefined,
    sequence: row.sequence,
    createdAt: row.createdAt.toISOString(),
    payload: row.payload,
  });
}

async function nextSequence(): Promise<number> {
  const last = await prisma.event.findFirst({ orderBy: { sequence: "desc" } });
  return (last?.sequence ?? 0) + 1;
}

export async function createEvent(input: CreateEventInput): Promise<ElementationEvent> {
  const row = await prisma.event.create({
    data: {
      id: createId(),
      type: input.type,
      sessionId: input.sessionId,
      projectKey: input.projectKey,
      sequence: await nextSequence(),
      payload: input.payload as Prisma.InputJsonValue,
    },
  });
  return toEvent(row);
}

export async function getEvent(id: string): Promise<ElementationEvent | null> {
  const row = await prisma.event.findUnique({ where: { id } });
  return row ? toEvent(row) : null;
}

export async function listEvents(options: ListEventsOptions = {}): Promise<ElementationEvent[]> {
  const rows = await prisma.event.findMany({
    where: {
      ...(options.sessionId ? { sessionId: options.sessionId } : {}),
      ...(options.projectKey ? { projectKey: options.projectKey } : {}),
      ...(options.afterSequence !== undefined ? { sequence: { gt: options.afterSequence } } : {}),
    },
    orderBy: { sequence: "asc" },
    take: options.limit ?? 100,
  });
  return rows.map(toEvent);
}
