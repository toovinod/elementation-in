import type { ElementationSession, SyncedElementationAnnotation } from "@elementation/core";

export function makeSession(overrides: Partial<ElementationSession> = {}): ElementationSession {
  return {
    id: "sess_1",
    projectKey: "el_demo",
    name: "/pricing",
    url: "http://localhost:3000/pricing",
    pathname: "/pricing",
    status: "active",
    createdAt: "2026-07-03T00:00:00.000Z",
    updatedAt: "2026-07-03T00:00:00.000Z",
    ...overrides,
  };
}

export function makeSyncedAnnotation(
  overrides: Partial<SyncedElementationAnnotation> = {},
): SyncedElementationAnnotation {
  return {
    id: "ann_1",
    projectKey: "el_demo",
    sessionId: "sess_1",
    status: "pending",
    thread: [],
    createdAt: "2026-07-03T00:00:00.000Z",
    updatedAt: "2026-07-03T00:00:00.000Z",
    generatedPrompt: "Make the button smaller and use the brand color.",
    capture: {
      id: "cap_1",
      projectKey: "el_demo",
      createdAt: "2026-07-03T00:00:00.000Z",
      feedback: "This button is too large.",
      page: { url: "http://localhost:3000/pricing", pathname: "/pricing", title: "Pricing" },
      viewport: { width: 1440, height: 900 },
      element: {
        tagName: "button",
        textContent: "Get Started",
        selector: "main section.hero button.primary-cta",
        className: "primary-cta",
        dataset: {},
      },
      box: { x: 0, y: 0, width: 220, height: 56, top: 0, left: 0, right: 220, bottom: 56 },
      styles: {
        display: "inline-flex",
        position: "static",
        width: "220px",
        height: "56px",
        margin: "0px",
        padding: "16px 28px",
        fontSize: "18px",
        fontWeight: "600",
        color: "rgb(255, 255, 255)",
        backgroundColor: "rgb(59, 130, 246)",
        border: "0px none",
        borderRadius: "8px",
        boxShadow: "none",
      },
      source: { componentName: "HeroCTA", filePath: "src/components/HeroCTA.tsx", lineNumber: 42 },
    },
    ...overrides,
  };
}
