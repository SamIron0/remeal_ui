import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { stripe } from "@/utils/stripe/config";
import { Tables } from "@/supabase/types";

export async function POST() {
  const supabase = createClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (!subscription?.id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys
    const stripe = require("stripe")(
      "sk_test_51N5uTxBwxSl9KXhsRPrwnsBiH4pMLyXEfhn1eWQ19XIItU1eMyI45poAaGiCiAc5jKZLvXib4bURXI2sqt9HNTbF00NNlW2mS4"
    );

    const deletedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        cancel_at_period_end: true,
      }
    );

    if (deletedSubscription.status === "canceled") {
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" as Tables<"subscriptions">["status"] })
        .eq("id", subscription.id);

      return NextResponse.json({
        message: "Subscription cancelled successfully",
      });
    } else {
      throw new Error("Failed to cancel subscription");
    }
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
