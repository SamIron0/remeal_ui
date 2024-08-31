"use client";
import React, { useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "@/components/CheckoutForm";
import CompletePage from "@/components/CompletePage";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = React.useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
  const [confirmed, setConfirmed] = React.useState<string | null>(null);

  useEffect(() => {
    setConfirmed(
      new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      )
    );
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const response = async () => {
      try {
        //console.log("running");
        const res = await fetch("/api/create_payment_intent", {
          method: "POST",
          body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
        });
        const data = await res.json();
        console.log("running", data);
        setClientSecret(data.clientSecret);
        // [DEV] For demo purposes only
        setDpmCheckerLink(data.dpmCheckerLink);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };
    response();
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements
          options={options as StripeElementsOptions}
          stripe={stripePromise}
        >
          {confirmed ? (
            <CompletePage />
          ) : (
            <CheckoutForm dpmCheckerLink={dpmCheckerLink} />
          )}
        </Elements>
      )}
    </div>
  );
}
