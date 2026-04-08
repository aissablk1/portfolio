import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not defined");
    _stripe = new Stripe(key, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
      maxNetworkRetries: 3,
      timeout: 15000,
      appInfo: {
        name: "Aïssa Portfolio",
        version: "1.0.0",
      },
    });
  }
  return _stripe;
}

// Re-export as `stripe` for convenience — lazy singleton
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return Reflect.get(getStripe(), prop);
  },
});
