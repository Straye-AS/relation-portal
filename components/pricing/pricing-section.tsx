"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PaymentButton } from "@/components/stripe/payment-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { STRIPE_PRODUCTS } from "@/src/stripe-config";
import { SubscriptionPlan } from "@/lib/utils";

interface PricingSectionProps {
  currentPlan?: string;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

export function PricingSection({ currentPlan = "free" }: PricingSectionProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the plan thats right for you and start building your SaaS product today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(STRIPE_PRODUCTS).map(([key, product]) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${product.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <PaymentButton
                product={key as keyof typeof STRIPE_PRODUCTS}
                variant={currentPlan === key.toLowerCase() ? "outline" : "default"}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}