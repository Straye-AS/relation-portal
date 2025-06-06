import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 font-bold text-lg"
      >
        SaaS<span className="text-primary">Kit</span>
      </Link>
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