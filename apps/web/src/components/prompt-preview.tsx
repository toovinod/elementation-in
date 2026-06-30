"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PromptPreviewProps {
  prompt: string;
  trigger?: ReactNode;
}

export function PromptPreview({ prompt, trigger }: PromptPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            View prompt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Coding Prompt</DialogTitle>
        </DialogHeader>
        <pre className="bg-muted max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg p-4 font-mono text-xs leading-relaxed">
          {prompt}
        </pre>
        <div className="flex justify-end">
          <CopyButton value={prompt} label="Copy Prompt" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
