'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    const response = await fetch('/api/create-checkout-session', { method: 'POST' });
    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({ sessionId });
    if (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleSubscribe} disabled={loading}>
      {loading ? 'Processing...' : 'Upgrade to Premium'}
    </Button>
  );
}