"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Github, Mail, Shield, User, Zap } from "lucide-react";

type Provider = "google" | "github";

export function OAuthButton({ provider }: { provider: Provider }) {
  const supabase = createClient();

  const handleOAuthLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
  };

  return (
    <Button
      onClick={handleOAuthLogin}
      className="w-full rounded-xl border border-input"
      variant="outline"
    >
      {provider === "google" && (
        <>
          <img src="/google.webp" alt="Google" className="h-4 w-4 mr-2" />
          Continue with Google
        </>
      )}
      {provider === "github" && (
        <>
          <Github className="h-4 w-4 mr-2" />
          Continue with GitHub
        </>
      )}
    </Button>
  );
}
