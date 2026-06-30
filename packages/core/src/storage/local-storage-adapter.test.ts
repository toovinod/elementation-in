import { afterEach, describe, expect, it, vi } from "vitest";
import type { ElementationAnnotation } from "../annotation";
import { LocalStorageAdapter } from "./local-storage-adapter";

function mockLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

function annotationFor(projectKey: string, id: string): ElementationAnnotation {
  return {
    id,
    projectKey,
    generatedPrompt: "prompt",
    createdAt: "2026-01-01T00:00:00.000Z",
    capture: {
      id,
      createdAt: "2026-01-01T00:00:00.000Z",
      feedback: "feedback",
      page: { url: "http://localhost:3000/", pathname: "/", title: "Home" },
      viewport: { width: 1280, height: 720 },
      element: { tagName: "button", textContent: "Go", selector: "button", dataset: {} },
      box: { x: 0, y: 0, width: 10, height: 10, top: 0, left: 0, right: 10, bottom: 10 },
      styles: {
        display: "block",
        position: "static",
        width: "10px",
        height: "10px",
        margin: "0px",
        padding: "0px",
        fontSize: "16px",
        fontWeight: "400",
        color: "rgb(0, 0, 0)",
        backgroundColor: "rgba(0, 0, 0, 0)",
        border: "0px none",
        borderRadius: "0px",
        boxShadow: "none",
      },
    },
  };
}

describe("LocalStorageAdapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates and lists projects", async () => {
    vi.stubGlobal("window", { localStorage: mockLocalStorage() });
    const adapter = new LocalStorageAdapter();

    const project = await adapter.createProject({ name: "Demo" });
    expect(project.key).toMatch(/^el_/);

    const projects = await adapter.listProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]?.name).toBe("Demo");
  });

  it("adds, filters, and removes annotations", async () => {
    vi.stubGlobal("window", { localStorage: mockLocalStorage() });
    const adapter = new LocalStorageAdapter();

    await adapter.addAnnotation(annotationFor("el_a", "1"));
    await adapter.addAnnotation(annotationFor("el_b", "2"));

    expect(await adapter.listAnnotations()).toHaveLength(2);
    expect(await adapter.listAnnotations("el_a")).toHaveLength(1);

    await adapter.removeAnnotation("1");
    expect(await adapter.listAnnotations()).toHaveLength(1);
  });

  it("returns empty results during server-side rendering", async () => {
    const adapter = new LocalStorageAdapter();
    expect(await adapter.listProjects()).toEqual([]);
  });
});
