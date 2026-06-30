"use client";

import { ElementationOverlay } from "@elementation/sdk";
import { DemoForm } from "./demo-form";
import { DemoHero } from "./demo-hero";
import { DemoNavbar } from "./demo-navbar";
import { DemoPricing } from "./demo-pricing";

export function PlaygroundSurface({ projectKey }: { projectKey: string }) {
  return (
    <>
      <div className="bg-background overflow-hidden rounded-xl border">
        <DemoNavbar />
        <DemoHero />
        <DemoPricing />
        <DemoForm />
      </div>
      <ElementationOverlay projectKey={projectKey} apiUrl="/api" />
    </>
  );
}
