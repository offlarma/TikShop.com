"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard]", error);
  }, [error]);

  return (
    <Card className="max-w-xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <CardTitle className="text-lg">Something went wrong</CardTitle>
        </div>
        <CardDescription>
          {error.message ||
            "An unexpected error occurred while rendering this page."}
          {error.digest ? (
            <span className="mt-2 block text-xs text-muted-foreground">
              Error ID: {error.digest}
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => reset()}>
          <RotateCw className="h-4 w-4" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
