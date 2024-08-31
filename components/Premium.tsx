'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Premium() {
  const router = useRouter();

  const handleSubscribe = async () => {
    router.push('/checkout');
  };

  return (
    <Button onClick={handleSubscribe}>
      Upgrade to Premium
    </Button>
  );
}