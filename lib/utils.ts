import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'NOK'): string {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function showError(message: string) {
  toast.error(message);
}

export function showSuccess(message: string) {
  toast.success(message);
}

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];

export const PRICES = {
  [SUBSCRIPTION_PLANS.BASIC]: {
    monthly: 9,
    yearly: 90, // 10% discount
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    monthly: 19,
    yearly: 190, // 10% discount
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    monthly: 49,
    yearly: 490, // 10% discount
  },
};

export const FEATURES = {
  [SUBSCRIPTION_PLANS.FREE]: [
    'Basic access',
    '2 projects',
    'Community support',
    '1GB storage',
  ],
  [SUBSCRIPTION_PLANS.BASIC]: [
    'Everything in Free',
    '10 projects',
    'Email support',
    '10GB storage',
    'API access',
  ],
  [SUBSCRIPTION_PLANS.PRO]: [
    'Everything in Basic',
    'Unlimited projects',
    'Priority support',
    '50GB storage',
    'Advanced analytics',
    'Custom branding',
  ],
  [SUBSCRIPTION_PLANS.ENTERPRISE]: [
    'Everything in Pro',
    'Dedicated support',
    'Unlimited storage',
    'SSO authentication',
    'Custom integrations',
    'Advanced security',
  ],
};