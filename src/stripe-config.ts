export const STRIPE_PRODUCTS = {
  BASIC: {
    id: 'prod_SK3j6XDyMHNtrP',
    name: 'Basic',
    description: 'Perfect for trying out the platform',
    priceId: 'price_1RXOdFR4180vV2vzstsIlApi',
    price: 19,
    mode: 'subscription' as const,
    features: [
      'Basic access',
      '2 projects',
      'Community support',
      '1GB storage',
      'Basic analytics',
    ],
  },
  PLUS: {
    id: 'prod_SLILb9CwBPHZfl',
    name: 'Plus',
    description: 'For individuals and small teams',
    priceId: 'price_1RXOdZR4180vV2vz2cwzuGUL',
    price: 49,
    mode: 'subscription' as const,
    features: [
      'Everything in Basic',
      '10 projects',
      'Email support',
      'API access',
      'Advanced analytics',
      'Team collaboration',
    ],
  },
  
  ELITE: {
    id: 'prod_SLIMID4CHzjlrm',
    name: 'Elite',
    description: 'For growing businesses and teams',
    priceId: 'price_1RXOdmR4180vV2vzeW1272Qy',
    price: 99,
    mode: 'subscription' as const,
    features: [
      'Everything in Plus',
      'Unlimited projects',
      'Priority support',
      'Custom integrations',
      'Advanced security',
      'SSO authentication',
    ],
  },
 
} as const;

export type StripeProduct = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS];
export type StripeProductId = StripeProduct['id'];
export type StripeProductName = StripeProduct['name'];
export type StripeProductMode = StripeProduct['mode'];