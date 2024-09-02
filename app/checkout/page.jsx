"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = (useState < string) | (null > null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const secret = searchParams.get("client");
    if (secret) {
      setClientSecret(secret);
    }
  }, [searchParams]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }
  const form = document.getElementById("payment-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://remeal.food/checkout/complete",
      },
    });

    if (error) {
      const messageContainer = document.querySelector("#error-message");
      messageContainer.textContent = error.message;
    } else {
    }
  });
  return (
    <form id="payment-form">
      <div id="payment-element"></div>
      <button id="submit">Subscribe</button>
      <div id="error-message"></div>
    </form>
  );
}
