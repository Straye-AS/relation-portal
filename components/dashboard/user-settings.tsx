"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  notifications: z.boolean().default(true),
});

interface UserSettingsProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
  preferences: {
    notifications_enabled: boolean;
    theme: string;
  };
}

export function UserSettings({ user, preferences }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.full_name || "",
      email: user.email,
      notifications: preferences.notifications_enabled,
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from("users")
        .update({ 
          full_name: values.fullName,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      // Update user preferences
      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .update({ 
          notifications_enabled: values.notifications,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id);

      if (preferencesError) {
        throw preferencesError;
      }

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account details and preferences
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled
                      placeholder="your@email.com" 
                    />
                  </FormControl>
                  <FormDescription>
                    Your email cannot be changed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}