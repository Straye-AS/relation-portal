"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  isLocalAuthEnabled,
  getAuthModePreference,
  setAuthModePreference,
} from "@/lib/auth/localAuthConfig";

interface AuthModeToggleProps {
  onModeChange?: () => void;
}

/**
 * Toggle component for switching between local and Microsoft authentication
 * Only visible when local auth is enabled in development
 */
export function AuthModeToggle({ onModeChange }: AuthModeToggleProps) {
  const [currentMode, setCurrentMode] = useState<"local" | "microsoft">(
    "local"
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentMode(getAuthModePreference());
  }, []);

  // Only show in development when local auth is enabled
  if (!mounted || !isLocalAuthEnabled()) {
    return null;
  }

  const handleToggle = () => {
    const newMode = currentMode === "local" ? "microsoft" : "local";
    setAuthModePreference(newMode);
    setCurrentMode(newMode);

    if (onModeChange) {
      onModeChange();
    }

    // Reload the page to apply the new auth mode
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 p-3">
      <Badge variant="outline" className="text-xs">
        DEV MODE
      </Badge>
      <span className="text-xs text-muted-foreground">Auth:</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="h-7 text-xs"
      >
        {currentMode === "local" ? <>🧪 Local</> : <>🔐 Microsoft</>}
      </Button>
      <span className="text-xs text-muted-foreground">(click to switch)</span>
    </div>
  );
}
