import { Boxes } from "lucide-react";

export function DemoNavbar() {
  return (
    <nav
      data-elementation-component="DemoNavbar"
      data-elementation-file="components/playground/demo-navbar.tsx"
      data-elementation-line="5"
      className="flex items-center justify-between border-b px-6 py-4"
    >
      <div className="brand flex items-center gap-2 font-semibold">
        <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-md">
          <Boxes className="size-4" />
        </span>
        Acme
      </div>
      <div className="hidden items-center gap-6 text-sm md:flex">
        <a
          className="nav-link text-muted-foreground hover:text-foreground transition-colors"
          href="#"
        >
          Features
        </a>
        <a
          className="nav-link text-muted-foreground hover:text-foreground transition-colors"
          href="#"
        >
          Pricing
        </a>
        <a
          className="nav-link text-muted-foreground hover:text-foreground transition-colors"
          href="#"
        >
          Docs
        </a>
      </div>
      <button className="signin-button rounded-md border px-4 py-2 text-sm font-medium">
        Sign in
      </button>
    </nav>
  );
}
