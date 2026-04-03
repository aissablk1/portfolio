import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return new Stripe(key, { typescript: true });
}

// Lazy initialization — only throws when actually used, not at import time
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as Record<string | symbol, unknown>)[prop];
  },
});
