"use client";

import { useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps extends Omit<ComponentProps<typeof Button>, "children"> {
  value: string;
  label?: string;
}

export function CopyButton({
  value,
  label = "Copy",
  variant = "secondary",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button variant={variant} onClick={() => void copy()} {...props}>
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  );
}
