"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CreditCard,
  Lock,
  Users,
  Settings,
  Zap,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: "Authentication",
    description: "Secure user authentication with email and password login, password reset, and protected routes.",
    icon: <Lock className="h-10 w-10 text-primary" />,
  },
  {
    title: "Subscription Management",
    description: "Flexible subscription plans with Stripe integration for seamless billing and payment processing.",
    icon: <CreditCard className="h-10 w-10 text-primary" />,
  },
  {
    title: "User Dashboard",
    description: "Beautiful and intuitive dashboard for users to manage their account, preferences, and subscriptions.",
    icon: <Users className="h-10 w-10 text-primary" />,
  },
  {
    title: "Analytics",
    description: "Insightful analytics to track user engagement, subscription metrics, and business performance.",
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
  },
  {
    title: "Customization",
    description: "Highly customizable components and settings to match your brand and business requirements.",
    icon: <Settings className="h-10 w-10 text-primary" />,
  },
  {
    title: "Performance",
    description: "Optimized for speed and efficiency with Next.js, ensuring a smooth user experience.",
    icon: <Zap className="h-10 w-10 text-primary" />,
  },
];

export function Features() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-4 transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Everything you need to succeed
          </h2>
          <p className={cn(
            "text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Our platform provides all the essential tools and features to build, launch,
            and scale your SaaS business.
          </p>
        </div>

        <Tabs defaultValue="features" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="features" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className={cn(
                  "border-[1.5px] bg-card border-border transition-all duration-700",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  { "delay-100": index % 3 === 0, "delay-200": index % 3 === 1, "delay-300": index % 3 === 2 }
                )}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="rounded-lg overflow-hidden border bg-card shadow-sm mx-auto max-w-4xl">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Dashboard Preview
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="focus-visible:outline-none focus-visible:ring-0">
            <div className="rounded-lg overflow-hidden border bg-card shadow-sm mx-auto max-w-4xl">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Billing Preview
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}