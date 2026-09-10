import { loadStripe } from "@stripe/stripe-js";

// Replace with your public Stripe key

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

export const stripePromise = loadStripe(STRIPE_KEY as string);
