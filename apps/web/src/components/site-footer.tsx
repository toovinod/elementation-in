import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/playground", label: "Playground" },
      { href: "/docs/installation", label: "Install" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
      { href: "/blog", label: "Blog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs/schema", label: "Capture Schema" },
      { href: "/docs/rest-api", label: "REST API" },
      { href: "/docs/source-mapping", label: "Source Mapping" },
      { href: "/colophon", label: "Colophon" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#fbfaf8]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4 md:px-6">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-xs text-sm leading-6 text-slate-500">
            Visual feedback that gives AI coding agents the exact UI context they need.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{group.title}</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-[#2f6fed]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-400 sm:flex-row md:px-6">
          <span>© 2026 Elementation</span>
          <span>elementation.in</span>
        </div>
      </div>
    </footer>
  );
}
