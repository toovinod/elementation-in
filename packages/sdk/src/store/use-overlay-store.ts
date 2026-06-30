import { create } from "zustand";
import type { ElementationCapture } from "@elementation/core";

export interface RectLike {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface HoveredTarget {
  rect: RectLike;
  label: string;
}

export interface SelectedTarget {
  capture: ElementationCapture;
  rect: RectLike;
}

interface OverlayState {
  inspect: boolean;
  hovered: HoveredTarget | null;
  selected: SelectedTarget | null;
  feedback: string;
  prompt: string | null;
  toggleInspect: () => void;
  exitInspect: () => void;
  setHovered: (hovered: HoveredTarget | null) => void;
  selectElement: (capture: ElementationCapture, rect: RectLike) => void;
  setFeedback: (feedback: string) => void;
  cancelSelection: () => void;
  showPrompt: (prompt: string) => void;
  closePrompt: () => void;
}

const cleared = { hovered: null, selected: null, feedback: "" } as const;

export const useOverlayStore = create<OverlayState>((set) => ({
  inspect: false,
  hovered: null,
  selected: null,
  feedback: "",
  prompt: null,
  toggleInspect: () => set((state) => ({ ...cleared, inspect: !state.inspect })),
  exitInspect: () => set({ ...cleared, inspect: false }),
  setHovered: (hovered) => set({ hovered }),
  selectElement: (capture, rect) =>
    set({ selected: { capture, rect }, hovered: null, feedback: "" }),
  setFeedback: (feedback) => set({ feedback }),
  cancelSelection: () => set({ selected: null, feedback: "" }),
  showPrompt: (prompt) => set({ prompt, selected: null, hovered: null, feedback: "" }),
  closePrompt: () => set({ prompt: null }),
}));
