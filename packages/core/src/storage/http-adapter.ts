import { z } from "zod";
import {
  annotationSchema,
  projectSchema,
  type ElementationAnnotation,
  type ElementationProject,
} from "../annotation";
import type { CaptureStore, CreateProjectInput } from "./types";

const projectsSchema = z.array(projectSchema);
const annotationsSchema = z.array(annotationSchema);

export class HttpAdapter implements CaptureStore {
  constructor(private readonly apiUrl: string) {}

  private endpoint(path: string): string {
    return `${this.apiUrl.replace(/\/$/, "")}${path}`;
  }

  private async request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
    const response = await fetch(this.endpoint(path), {
      ...init,
      headers: { "content-type": "application/json", ...init?.headers },
    });
    if (!response.ok) {
      throw new Error(`Elementation API error ${response.status}: ${await response.text()}`);
    }
    return schema.parse(await response.json());
  }

  listProjects(): Promise<ElementationProject[]> {
    return this.request("/projects", projectsSchema);
  }

  getProject(idOrKey: string): Promise<ElementationProject | null> {
    return this.request(`/projects/${encodeURIComponent(idOrKey)}`, projectSchema.nullable());
  }

  createProject(input: CreateProjectInput): Promise<ElementationProject> {
    return this.request("/projects", projectSchema, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  listAnnotations(projectKey?: string): Promise<ElementationAnnotation[]> {
    const query = projectKey ? `?projectKey=${encodeURIComponent(projectKey)}` : "";
    return this.request(`/annotations${query}`, annotationsSchema);
  }

  addAnnotation(annotation: ElementationAnnotation): Promise<ElementationAnnotation> {
    return this.request("/annotations", annotationSchema, {
      method: "POST",
      body: JSON.stringify(annotation),
    });
  }

  async removeAnnotation(id: string): Promise<void> {
    await this.request(`/annotations/${encodeURIComponent(id)}`, z.unknown(), { method: "DELETE" });
  }
}
