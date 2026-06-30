import type { ElementationAnnotation, ElementationProject } from "../annotation";

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
