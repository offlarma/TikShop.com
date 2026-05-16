import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find what you were looking for. It may have been
            moved or it never existed.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
