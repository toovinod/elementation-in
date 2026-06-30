import { CodeBlock } from "@/components/code-block";
import { siteConfig } from "@/lib/site";

export function InstallSnippet({ projectKey }: { projectKey: string }) {
  const install = "pnpm add @elementation/sdk";
  const usage = `import { ElementationOverlay } from "@elementation/sdk";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ElementationOverlay
            projectKey="${projectKey}"
            apiUrl="${siteConfig.url}/api"
          />
        )}
      </body>
    </html>
  );
}`;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 text-sm font-medium">1. Install the SDK</div>
        <CodeBlock code={install} language="bash" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">2. Mount the overlay (development only)</div>
        <CodeBlock code={usage} language="tsx" />
        <p className="text-muted-foreground mt-2 text-sm">
          The overlay renders into an isolated Shadow DOM root, so it never inherits or leaks styles
          and never selects itself.
        </p>
      </div>
    </div>
  );
}
