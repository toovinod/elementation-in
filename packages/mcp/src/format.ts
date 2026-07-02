import type {
  ElementationSession,
  SyncedElementationAnnotation,
  ThreadMessage,
} from "@elementation/core";

export interface AnnotationSummary {
  id: string;
  sessionId?: string;
  status: string;
  feedback: string;
  element: string;
  selector: string;
  text: string;
  page: string;
  component?: string;
  file?: string;
  line?: number;
}

function truncate(value: string, max: number): string {
  const collapsed = value.replace(/\s+/g, " ").trim();
  return collapsed.length > max ? `${collapsed.slice(0, max - 1)}…` : collapsed;
}

export function summarizeAnnotation(annotation: SyncedElementationAnnotation): AnnotationSummary {
  const { capture } = annotation;
  return {
    id: annotation.id,
    sessionId: annotation.sessionId,
    status: annotation.status,
    feedback: capture.feedback,
    element: capture.element.tagName,
    selector: capture.element.selector,
    text: capture.element.textContent,
    page: capture.page.url,
    component: capture.source?.componentName,
    file: capture.source?.filePath,
    line: capture.source?.lineNumber,
  };
}

export function formatAnnotation(annotation: SyncedElementationAnnotation): string {
  const { capture } = annotation;
  const source = capture.source?.filePath
    ? `${capture.source.componentName ?? "component"} — ${capture.source.filePath}${
        capture.source.lineNumber ? `:${capture.source.lineNumber}` : ""
      }`
    : undefined;

  const lines: Array<string | undefined> = [
    `Annotation ${annotation.id} [${annotation.status}]`,
    annotation.sessionId ? `Session: ${annotation.sessionId}` : undefined,
    `Feedback: ${capture.feedback}`,
    `Element: <${capture.element.tagName}> ${truncate(capture.element.textContent, 80)}`.trimEnd(),
    `Selector: ${capture.element.selector}`,
    `Page: ${capture.page.url}`,
    source ? `Source: ${source}` : undefined,
    annotation.thread.length > 0 ? `Thread: ${annotation.thread.length} message(s)` : undefined,
    "",
    "--- Generated prompt ---",
    annotation.generatedPrompt,
  ];
  return lines.filter((line): line is string => line !== undefined).join("\n");
}

export function formatAnnotationList(annotations: SyncedElementationAnnotation[]): string {
  if (annotations.length === 0) return "No annotations.";
  return annotations
    .map((annotation) => {
      const summary = summarizeAnnotation(annotation);
      const location = summary.file
        ? ` (${summary.file}${summary.line ? `:${summary.line}` : ""})`
        : "";
      return `- ${summary.id} [${summary.status}] <${summary.element}> "${truncate(summary.feedback, 100)}"${location}`;
    })
    .join("\n");
}

export function formatSession(session: ElementationSession): string {
  return [
    `Session ${session.id} [${session.status}]`,
    `Name: ${session.name}`,
    session.url ? `URL: ${session.url}` : undefined,
    session.projectKey ? `Project: ${session.projectKey}` : undefined,
    `Updated: ${session.updatedAt}`,
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n");
}

export function formatSessionList(sessions: ElementationSession[]): string {
  if (sessions.length === 0) return "No sessions yet.";
  return sessions
    .map(
      (session) =>
        `- ${session.id} [${session.status}] ${session.name}${session.url ? ` — ${session.url}` : ""}`,
    )
    .join("\n");
}

export function formatThreadMessage(message: ThreadMessage): string {
  return `Replied to ${message.annotationId} as ${message.role}: ${message.message}`;
}
