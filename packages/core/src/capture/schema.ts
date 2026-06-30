import { z } from "zod";

export const viewportSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const pageSchema = z.object({
  url: z.string(),
  pathname: z.string(),
  title: z.string(),
});

export const elementMetaSchema = z.object({
  tagName: z.string(),
  textContent: z.string(),
  selector: z.string(),
  id: z.string().optional(),
  className: z.string().optional(),
  role: z.string().optional(),
  ariaLabel: z.string().optional(),
  dataset: z.record(z.string(), z.string()),
});

export const boxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  top: z.number(),
  left: z.number(),
  right: z.number(),
  bottom: z.number(),
});

export const captureStylesSchema = z.object({
  display: z.string(),
  position: z.string(),
  width: z.string(),
  height: z.string(),
  margin: z.string(),
  padding: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  color: z.string(),
  backgroundColor: z.string(),
  border: z.string(),
  borderRadius: z.string(),
  boxShadow: z.string(),
});

export const sourceMetadataSchema = z.object({
  componentName: z.string().optional(),
  filePath: z.string().optional(),
  lineNumber: z.number().optional(),
  columnNumber: z.number().optional(),
});

export const elementationCaptureSchema = z.object({
  id: z.string(),
  projectKey: z.string().optional(),
  createdAt: z.string(),
  feedback: z.string(),
  page: pageSchema,
  viewport: viewportSchema,
  element: elementMetaSchema,
  box: boxSchema,
  styles: captureStylesSchema,
  source: sourceMetadataSchema.optional(),
});

export type Viewport = z.infer<typeof viewportSchema>;
export type PageMeta = z.infer<typeof pageSchema>;
export type ElementMeta = z.infer<typeof elementMetaSchema>;
export type CaptureBox = z.infer<typeof boxSchema>;
export type CaptureStyles = z.infer<typeof captureStylesSchema>;
export type SourceMetadata = z.infer<typeof sourceMetadataSchema>;
export type ElementationCapture = z.infer<typeof elementationCaptureSchema>;
