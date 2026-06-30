import { z } from "zod";
import { elementationCaptureSchema } from "./capture/schema";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  createdAt: z.string(),
});

export const annotationSchema = z.object({
  id: z.string(),
  projectKey: z.string().optional(),
  capture: elementationCaptureSchema,
  generatedPrompt: z.string(),
  createdAt: z.string(),
});

export type ElementationProject = z.infer<typeof projectSchema>;
export type ElementationAnnotation = z.infer<typeof annotationSchema>;
