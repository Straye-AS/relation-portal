import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}