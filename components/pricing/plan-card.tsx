"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, FEATURES, SubscriptionPlan } from "@/lib/utils";

interface PlanCardProps {
  name: string;
  description: string;
  price: number | null;
  features: string[];
  highlighted?: boolean;
  isCurrentPlan?: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  planType: SubscriptionPlan;
  isYearly: boolean;
}

export function PlanCard({
  name,
  description,
  price,
  features,
  highlighted = false,
  isCurrentPlan = false,
  onSelectPlan,
  planType,
  isYearly,
}: PlanCardProps) {
  return (
    <Card className={`flex flex-col h-full ${highlighted ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          {price === null ? (
            <div className="text-4xl  ">Free</div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-4xl  ">{formatCurrency(price)}</span>
              <span className="text-muted-foreground ml-2">/{isYearly ? 'year' : 'month'}</span>
            </div>
          )}
          {isYearly && price !== null && (
            <p className="text-sm text-primary font-medium mt-2">Save 10% with annual billing</p>
          )}
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary shrink-0 mr-2 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          className="w-full"
          variant={highlighted ? "default" : "outline"}
          onClick={() => onSelectPlan(planType)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? "Current Plan" : planType === "free" ? "Current Plan" : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}