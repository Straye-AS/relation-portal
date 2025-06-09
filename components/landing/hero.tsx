"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 pointer-events-none" />
      
      {/* Content */}
      <div className="container relative px-4 mx-auto">
        <div className="max-w-6xl mx-auto text-center">
          <div className={cn(
            "inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full border transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <span className="mr-2">✨</span>
            <span>Introducing NeoSaaS</span>
          </div>
          <div className="max-w-3xl mx-auto">
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Build your SaaS product <span className="text-[#8C50F7]">faster </span>than ever
          </h1>
          
          <p className={cn(
            "text-xl font-light text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Everything you need to launch, grow, and scale your SaaS business. 
            Authentication, payments, and a beautiful UI right out of the box.
          </p>
          </div>          
          <div className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button asChild size="lg" className="px-8">
              <Link href="/sign-up">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          
          <div className={cn(
            "flex flex-wrap justify-center items-center gap-x-8 gap-y-6 transition-all duration-700 delay-400",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="flex items-center border border-border rounded-xl p-2">
              <Image
                src="/next.png"
                alt="Next.js"
                width={80}
                height={48}
                className="h-8 w-auto hover:opacity-100 transition-opacity rounded-md dark:invert"
              />
            </div>
            
            <div className="flex items-center border border-border rounded-xl p-2">
              <Image
                src="/supabase.png"
                alt="Supabase"
                width={80}
                height={48}
                className="h-8 w-auto hover:opacity-100 transition-opacity rounded-md"
              />
            </div>
            
            <div className="flex items-center border border-border rounded-xl p-2">
              <Image
                src="/stripe2.webp"
                alt="Stripe"
                width={80}
                height={48}
                className="h-8 w-auto hover:opacity-100 transition-opacity rounded-md"
              />
            </div>
           
            <div className="flex items-center border border-border rounded-xl p-2">
              <Image
                src="/open-ai.png"
                alt="OpenAI"
                width={80}
                height={48}
                className="dark:invert h-8 w-auto hover:opacity-100 transition-opacity rounded-md"
              />
            </div>
          </div>
          
          <div className={cn(
            "mt-12 transition-all duration-700 delay-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="relative w-full rounded-xl overflow-hidden border border-border max-w-6xl">
              <Image
                src="/light.png"
                alt="Product Demo"
                width={1399}
                height={782}
                className="block dark:hidden"
                priority
              />
              <Image
                src="/dark.png"
                alt="Product Demo"
                width={1399}
                height={782}
                className="hidden dark:block"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}