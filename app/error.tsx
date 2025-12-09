"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex items-center gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h2 className="text-lg font-semibold">Something went wrong!</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        </div>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    </div>
  );
}
