import { z } from "zod";
import {
  annotationSchema,
  projectSchema,
  type ElementationAnnotation,
  type ElementationProject,
} from "../annotation";
import { SCHEMA_VERSION, STORAGE_KEYS } from "../constants";
import { createId, createProjectKey } from "../id";
import type { CaptureStore, CreateProjectInput } from "./types";

interface Envelope {
  version: number;
  data: unknown;
}

const projectsSchema = z.array(projectSchema);
const annotationsSchema = z.array(annotationSchema);

function read<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const envelope = JSON.parse(raw) as Envelope;
    const result = schema.safeParse(envelope.data);
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, data: unknown): void {
  if (typeof window === "undefined") return;
  const envelope: Envelope = { version: SCHEMA_VERSION, data };
  window.localStorage.setItem(key, JSON.stringify(envelope));
}

export class LocalStorageAdapter implements CaptureStore {
  async listProjects(): Promise<ElementationProject[]> {
    return read(STORAGE_KEYS.projects, projectsSchema, []);
  }

  async getProject(idOrKey: string): Promise<ElementationProject | null> {
    const projects = await this.listProjects();
    return projects.find((p) => p.id === idOrKey || p.key === idOrKey) ?? null;
  }

  async createProject(input: CreateProjectInput): Promise<ElementationProject> {
    const projects = await this.listProjects();
    const project: ElementationProject = {
      id: createId(),
      name: input.name,
      key: input.key ?? createProjectKey(),
      createdAt: new Date().toISOString(),
    };
    write(STORAGE_KEYS.projects, [project, ...projects]);
    return project;
  }

  async listAnnotations(projectKey?: string): Promise<ElementationAnnotation[]> {
    const annotations = read(STORAGE_KEYS.annotations, annotationsSchema, []);
    return projectKey ? annotations.filter((a) => a.projectKey === projectKey) : annotations;
  }

  async addAnnotation(annotation: ElementationAnnotation): Promise<ElementationAnnotation> {
    const annotations = read(STORAGE_KEYS.annotations, annotationsSchema, []);
    write(STORAGE_KEYS.annotations, [annotation, ...annotations]);
    return annotation;
  }

  async removeAnnotation(id: string): Promise<void> {
    const annotations = read(STORAGE_KEYS.annotations, annotationsSchema, []);
    write(
      STORAGE_KEYS.annotations,
      annotations.filter((a) => a.id !== id),
    );
  }
}
