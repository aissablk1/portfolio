import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not defined");
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Re-export as `stripe` for convenience — lazy singleton
export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    return Reflect.get(getStripe(), prop);
  },
});
