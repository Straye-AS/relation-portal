"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PaymentButton } from "@/components/stripe/payment-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckIcon } from "lucide-react";
import { STRIPE_PRODUCTS } from "@/src/stripe-config";
import { SubscriptionPlan } from "@/lib/utils";

interface PricingSectionProps {
  currentPlan?: string;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
}

const faqData = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. We also offer PayPal and SEPA Direct Debit options."
  },
  {
    question: "Can I change my plan at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will take effect in your next billing cycle."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card information is required."
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel at any time. Your access will continue until the end of your current billing cycle."
  },
  {
    question: "How can I view my invoices?",
    answer: "You can view and download all your invoices from the 'Billing' tab in your dashboard."
  },
  {
    question: "How can I get customer support?",
    answer: "We offer 24/7 email support. Premium plans also include priority support and phone support."
  },
  {
    question: "Are my data secure?",
    answer: "Yes, all your data is encrypted and stored in SOC 2 Type II certified data centers. We comply with GDPR and other data protection regulations."
  },
  {
    question: "What are the API limits?",
    answer: "With the Basic plan, you can make 10,000 API calls per month, with the Plus plan you can make 100,000 API calls per month, and with the Elite plan you can make unlimited API calls."
  }
];

export function PricingSection({ currentPlan = "free" }: PricingSectionProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl mb-4">Simple, transparent pricing</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the plan thats right for you and start building your SaaS product today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {Object.entries(STRIPE_PRODUCTS).map(([key, product]) => (
          <Card 
            key={product.id} 
            className={`flex flex-col transition-all duration-300 ${
              product.name === "Plus" 
                ? "border-2 border-purple-500 relative scale-105 z-10 shadow-xl" 
                : ""
            }`}
          >
            {product.name === "Plus" && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
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
                    <CheckIcon className="h-5 w-5 text-sm shrink-0 mr-2 mt-0.5" />
                    <span className="text-sm">{feature}</span>
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
      
      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl mb-4">Frequently Asked Questions</h3>
          <p className="text-muted-foreground">
            Frequently asked questions about our pricing and plans.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="px-6 data-[state=open]"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}