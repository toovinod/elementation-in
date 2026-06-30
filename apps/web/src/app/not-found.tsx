import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md py-24 text-center">
        <div className="text-primary text-sm font-semibold">404</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground mt-2">That page doesn&apos;t exist or has moved.</p>
        <Button asChild className="mt-6">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </AppShell>
  );
}
