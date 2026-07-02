import { z } from "zod";
import { annotationSchema } from "./annotation";

export const annotationStatusSchema = z.enum(["pending", "acknowledged", "resolved", "dismissed"]);

export const threadMessageRoleSchema = z.enum(["human", "agent", "system"]);

export const threadMessageSchema = z.object({
  id: z.string(),
  annotationId: z.string(),
  role: threadMessageRoleSchema,
  message: z.string(),
  createdAt: z.string(),
});

export const syncedAnnotationSchema = annotationSchema.extend({
  sessionId: z.string().optional(),
  status: annotationStatusSchema.default("pending"),
  acknowledgedAt: z.string().optional(),
  resolvedAt: z.string().optional(),
  resolvedBy: z.enum(["human", "agent"]).optional(),
  dismissedAt: z.string().optional(),
  dismissedReason: z.string().optional(),
  thread: z.array(threadMessageSchema).default([]),
  updatedAt: z.string(),
});

export const sessionStatusSchema = z.enum(["active", "closed", "approved"]);

export const sessionSchema = z.object({
  id: z.string(),
  projectKey: z.string().optional(),
  name: z.string(),
  url: z.string().optional(),
  pathname: z.string().optional(),
  userAgent: z.string().optional(),
  status: sessionStatusSchema.default("active"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const actionRequestSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  annotationId: z.string().optional(),
  action: z.string(),
  message: z.string().optional(),
  createdAt: z.string(),
});

export const eventTypeSchema = z.enum([
  "session.created",
  "session.updated",
  "session.closed",
  "annotation.created",
  "annotation.updated",
  "annotation.deleted",
  "annotation.acknowledged",
  "annotation.resolved",
  "annotation.dismissed",
  "thread.message.created",
  "prompt.generated",
  "action.requested",
]);

export const eventPayloadSchema = z.union([
  sessionSchema,
  syncedAnnotationSchema,
  annotationSchema,
  threadMessageSchema,
  actionRequestSchema,
  z.record(z.string(), z.unknown()),
]);

export const elementationEventSchema = z.object({
  id: z.string(),
  type: eventTypeSchema,
  sessionId: z.string().optional(),
  projectKey: z.string().optional(),
  sequence: z.number().int().nonnegative(),
  createdAt: z.string(),
  payload: eventPayloadSchema,
});

export const webhookEndpointSchema = z.object({
  id: z.string(),
  projectKey: z.string().optional(),
  url: z.string().url(),
  secret: z.string(),
  events: z.array(eventTypeSchema),
  enabled: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const webhookDeliveryStatusSchema = z.enum(["pending", "delivered", "failed"]);

export const webhookDeliverySchema = z.object({
  id: z.string(),
  webhookId: z.string(),
  eventId: z.string(),
  status: webhookDeliveryStatusSchema,
  attempts: z.number().int().nonnegative(),
  nextAttemptAt: z.string().optional(),
  responseStatus: z.number().int().optional(),
  responseBody: z.string().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AnnotationStatus = z.infer<typeof annotationStatusSchema>;
export type ThreadMessageRole = z.infer<typeof threadMessageRoleSchema>;
export type ThreadMessage = z.infer<typeof threadMessageSchema>;
export type SyncedElementationAnnotation = z.infer<typeof syncedAnnotationSchema>;
export type SessionStatus = z.infer<typeof sessionStatusSchema>;
export type ElementationSession = z.infer<typeof sessionSchema>;
export type ActionRequest = z.infer<typeof actionRequestSchema>;
export type ElementationEventType = z.infer<typeof eventTypeSchema>;
export type ElementationEvent = z.infer<typeof elementationEventSchema>;
export type WebhookEndpoint = z.infer<typeof webhookEndpointSchema>;
export type WebhookDeliveryStatus = z.infer<typeof webhookDeliveryStatusSchema>;
export type WebhookDelivery = z.infer<typeof webhookDeliverySchema>;
