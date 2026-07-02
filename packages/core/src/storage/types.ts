import type { ElementationAnnotation, ElementationProject } from "../annotation";
import type {
  AnnotationStatus,
  ElementationEvent,
  ElementationEventType,
  ElementationSession,
  SyncedElementationAnnotation,
  ThreadMessage,
  WebhookEndpoint,
} from "../lifecycle";

export interface CreateProjectInput {
  name: string;
  key?: string;
}

export interface CaptureStore {
  listProjects(): Promise<ElementationProject[]>;
  getProject(idOrKey: string): Promise<ElementationProject | null>;
  createProject(input: CreateProjectInput): Promise<ElementationProject>;
  listAnnotations(projectKey?: string): Promise<ElementationAnnotation[]>;
  addAnnotation(annotation: ElementationAnnotation): Promise<ElementationAnnotation>;
  removeAnnotation(id: string): Promise<void>;
}

export interface CaptureStoreConfig {
  apiUrl?: string;
}

export interface CreateSessionInput {
  id?: string;
  projectKey?: string;
  name?: string;
  url?: string;
  pathname?: string;
  userAgent?: string;
}

export interface UpdateSessionInput {
  status?: ElementationSession["status"];
  url?: string;
  pathname?: string;
}

export interface AnnotationLifecycleUpdate {
  status?: AnnotationStatus;
  feedback?: string;
  generatedPrompt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  resolvedBy?: "human" | "agent";
  dismissedAt?: string;
  dismissedReason?: string;
}

export interface CreateThreadMessageInput {
  id?: string;
  annotationId: string;
  role: "human" | "agent" | "system";
  message: string;
}

export interface CreateEventInput {
  type: ElementationEventType;
  sessionId?: string;
  projectKey?: string;
  payload: ElementationEvent["payload"];
}

export interface ListEventsOptions {
  sessionId?: string;
  projectKey?: string;
  afterSequence?: number;
  limit?: number;
}

export interface WebhookEndpointInput {
  id?: string;
  projectKey?: string;
  url: string;
  secret: string;
  events: ElementationEventType[];
  enabled?: boolean;
}

export interface ElementationServerStore {
  listSessions(): Promise<ElementationSession[]>;
  getSession(id: string): Promise<ElementationSession | null>;
  createSession(input: CreateSessionInput): Promise<ElementationSession>;
  updateSession(id: string, input: UpdateSessionInput): Promise<ElementationSession | null>;
  addSyncedAnnotation(
    annotation: ElementationAnnotation & { sessionId?: string },
  ): Promise<SyncedElementationAnnotation>;
  getSyncedAnnotation(id: string): Promise<SyncedElementationAnnotation | null>;
  listSyncedAnnotations(sessionId?: string): Promise<SyncedElementationAnnotation[]>;
  listPendingAnnotations(sessionId?: string): Promise<SyncedElementationAnnotation[]>;
  updateAnnotation(
    id: string,
    input: AnnotationLifecycleUpdate,
  ): Promise<SyncedElementationAnnotation | null>;
  deleteAnnotation(id: string): Promise<SyncedElementationAnnotation | null>;
  addThreadMessage(input: CreateThreadMessageInput): Promise<ThreadMessage>;
  listEvents(options?: ListEventsOptions): Promise<ElementationEvent[]>;
  createEvent(input: CreateEventInput): Promise<ElementationEvent>;
  listWebhookEndpoints(projectKey?: string): Promise<WebhookEndpoint[]>;
  createWebhookEndpoint(input: WebhookEndpointInput): Promise<WebhookEndpoint>;
  updateWebhookEndpoint(
    id: string,
    input: Partial<Omit<WebhookEndpointInput, "id">>,
  ): Promise<WebhookEndpoint | null>;
}
