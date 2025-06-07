"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LogOut, 
  Home, 
  BarChart3, 
  CreditCard, 
  Settings, 
  User, 
  FileText,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push("/sign-in");
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    getUser();
  }, [supabase, router]);

  const handleSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      
      // Clear any existing session state
      setUser(null);
      
      // For development: Clear all storage
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Clearing storage...');
        localStorage.clear();
        sessionStorage.clear();
        // Clear all cookies
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Ensures local session is cleared
      });
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Even if there's an error, try to redirect
      } else {
        console.log('Successfully signed out from Supabase');
      }
      
      // Clear any cached data and force redirect
      window.location.href = '/';
      
    } catch (error) {
      console.error('SignOut catch error:', error);
      // Force redirect even if there's an error
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Settings Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <p className="text-sm text-muted-foreground">{user.user_metadata?.full_name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">User ID</label>
              <p className="text-sm text-muted-foreground font-mono text-xs">{user.id}</p>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Theme</label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="sm">
              Change Password
            </Button>
            <Button variant="outline" size="sm">
              Two-Factor Authentication
            </Button>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="sm">
              Download Data
            </Button>
            <Button variant="outline" size="sm">
              Privacy Settings
            </Button>
            <Button variant="outline" size="sm">
              Cookie Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}