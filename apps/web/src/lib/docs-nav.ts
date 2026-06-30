export interface DocsNavItem {
  title: string;
  href: string;
}

export interface DocsNavSection {
  title: string;
  items: DocsNavItem[];
}

export const docsNav: DocsNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "The Overlay", href: "/docs/overlay" },
      { title: "Capture Schema", href: "/docs/schema" },
      { title: "Prompt Output", href: "/docs/prompt-output" },
      { title: "Source Mapping", href: "/docs/source-mapping" },
      { title: "Features", href: "/docs/features" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "SDK API", href: "/docs/sdk-api" },
      { title: "REST API", href: "/docs/rest-api" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Self-hosting", href: "/docs/self-hosting" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "MCP server", href: "/docs/mcp" },
      { title: "Webhooks", href: "/docs/webhooks" },
    ],
  },
  {
    title: "More",
    items: [
      { title: "FAQ", href: "/faq" },
      { title: "Roadmap", href: "/docs/roadmap" },
    ],
  },
];
