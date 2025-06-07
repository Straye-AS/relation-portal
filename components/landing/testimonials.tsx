"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    content: "SaaSKit has been a game-changer for our business. We were able to launch our product in just two weeks instead of months.",
    author: "Sarah Johnson",
    role: "Founder & CEO",
    company: "GrowthMetrics",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    content: "The authentication and subscription management features saved us hundreds of development hours. Highly recommended!",
    author: "Michael Chen",
    role: "CTO",
    company: "DevTools Inc",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
  {
    content: "Clean code, excellent documentation, and responsive support. Everything you need to build a professional SaaS product.",
    author: "Emily Rodriguez",
    role: "Lead Developer",
    company: "TechStart",
    avatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150"
  },
];

export function Testimonials() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl mb-4 transition-all duration-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Trusted by developers worldwide
          </h2>
          <p className={cn(
            "text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            See what our customers are saying about their experience with SaaSKit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={cn(
              "h-full transition-all duration-700 hover:shadow-md",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              { "delay-100": index === 0, "delay-200": index === 1, "delay-300": index === 2 }
            )}>
              <CardContent className="p-6 flex flex-col h-full">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-sm font-light mb-6 flex-grow">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{testimonial.author}</h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}