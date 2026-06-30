import type { ElementationAnnotation } from "@elementation/core";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { PromptPreview } from "@/components/prompt-preview";

export function AnnotationList({ annotations }: { annotations: ElementationAnnotation[] }) {
  if (annotations.length === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed px-4 py-10 text-center text-sm">
        No annotations yet. Install the SDK in your app or open the playground to create one.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-lg border">
      {annotations.map((annotation) => (
        <li
          key={annotation.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="muted">{annotation.capture.element.tagName}</Badge>
              <code className="text-muted-foreground truncate text-xs">
                {annotation.capture.element.selector}
              </code>
            </div>
            <p className="text-sm">
              {annotation.capture.feedback || (
                <span className="text-muted-foreground">No feedback provided</span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <PromptPreview prompt={annotation.generatedPrompt} />
            <CopyButton value={annotation.generatedPrompt} label="Copy" variant="ghost" size="sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}
