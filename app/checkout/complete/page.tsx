"use client";

import { useEffect, useState } from "react";
import { getStripe } from "@/utils/stripe/client";

export default function Checkout() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const stripe = await getStripe();
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) {
        setMessage("No payment intent client secret found.");
        return;
      }

      try {
        const stripe = await getStripe();
        const result = await stripe?.retrievePaymentIntent(clientSecret);
        const paymentIntent = result?.paymentIntent;

        if (!paymentIntent) {
          setMessage("Failed to retrieve payment intent.");
          return;
        }

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Success! Payment received.");
            break;
          case "processing":
            setMessage(
              "Payment processing. We'll update you when payment is received."
            );
            break;
          case "requires_payment_method":
            setMessage("Payment failed. Please try another payment method.");
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      } catch (error) {
        console.error("Error retrieving payment intent:", error);
        setMessage("An error occurred while processing your payment.");
      }
    };

    fetchPaymentIntent();
  }, []);

  return (
    <div>
      <h1>Checkout Complete</h1>
      <p id="message">{message}</p>
    </div>
  );
}
