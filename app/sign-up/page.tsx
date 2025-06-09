"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browserClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";
import { Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignUpPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Kullanıcı zaten giriş yapmış, dashboard'a yönlendir
        router.push('/dashboard');
        return;
      }
      
      setLoading(false);
    }

    checkUser();

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          router.push('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="absolute top-4 left-4 md:left-8 md:top-8 flex items-center gap-2">
        <Rocket className="h-6 w-6 text-primary" />
        <Link href="/" className="text-lg font-bold">
          ACME Inc.
        </Link>
        {/* <ThemeToggle /> */}
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="sign-up" />
        </CardContent>
      </Card>
    </div>
  );
}