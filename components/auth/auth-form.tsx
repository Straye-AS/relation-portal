"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Schema for sign in
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Schema for sign up
const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
});

// Schema for password reset
const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type AuthFormProps = {
  type: "sign-in" | "sign-up" | "reset-password";
};

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Select the appropriate schema based on form type
  const formSchema = 
    type === "sign-in" ? signInSchema :
    type === "sign-up" ? signUpSchema :
    resetSchema;

  // Set up form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: type !== "reset-password" ? "" : undefined,
      fullName: type === "sign-up" ? "" : undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (type === "sign-in") {
        // Handle sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password as string,
        });

        if (error) {
          throw error;
        }

        toast.success("Signed in successfully");
        router.push("/dashboard");
        router.refresh();
      } else if (type === "sign-up") {
        // Handle sign up
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password as string,
          options: {
            data: {
              full_name: values.fullName,
            },
          },
        });

        if (error) {
          throw error;
        }

        toast.success("Account created successfully");
        router.push("/dashboard");
        router.refresh();
      } else if (type === "reset-password") {
        // Handle password reset
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${window.location.origin}/reset-password/confirm`,
        });

        if (error) {
          throw error;
        }

        toast.success("Password reset email sent");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {type === "sign-in" ? "Sign In" : type === "sign-up" ? "Create an Account" : "Reset Password"}
        </h1>
        <p className="text-muted-foreground">
          {type === "sign-in" 
            ? "Enter your email and password to sign in to your account" 
            : type === "sign-up" 
            ? "Enter your details to create a new account"
            : "Enter your email to reset your password"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {type !== "reset-password" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "sign-in" ? "Signing in..." : type === "sign-up" ? "Creating account..." : "Sending email..."}
              </>
            ) : (
              type === "sign-in" ? "Sign In" : type === "sign-up" ? "Create Account" : "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        {type === "sign-in" ? (
          <>
            <Link href="/reset-password\" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <div className="mt-2">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </>
        ) : type === "sign-up" ? (
          <div>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        ) : (
          <div>
            Remember your password?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}