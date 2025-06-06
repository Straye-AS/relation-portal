export const STRIPE_PRODUCTS = {
  ELITE: {
    id: 'prod_SLIMID4CHzjlrm',
    name: 'Elite',
    description: 'For growing businesses and teams',
    priceId: 'price_1RQblqJoSiKWb2MdyUKmYj9O',
    price: 49.00,
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
  PLUS: {
    id: 'prod_SLILb9CwBPHZfl',
    name: 'Plus',
    description: 'For individuals and small teams',
    priceId: 'price_1RQbkYJoSiKWb2MdEF3JsP1z',
    price: 29.00,
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
  BASIC: {
    id: 'prod_SK3j6XDyMHNtrP',
    name: 'Basic',
    description: 'Perfect for trying out the platform',
    priceId: 'price_1RPPbbJoSiKWb2MdXbffcx7E',
    price: 9.90,
    mode: 'subscription' as const,
    features: [
      'Basic access',
      '2 projects',
      'Community support',
      '1GB storage',
      'Basic analytics',
    ],
  },
} as const;

export type StripeProduct = typeof STRIPE_PRODUCTS[keyof typeof STRIPE_PRODUCTS];
export type StripeProductId = StripeProduct['id'];
export type StripeProductName = StripeProduct['name'];
export type StripeProductMode = StripeProduct['mode'];