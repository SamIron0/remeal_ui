import Pricing from "@/components/Pricing";
import { createClient } from "@/utils/supabase/server";
import {
  getProducts,
  getSubscription,
  getUser,
} from "@/utils/supabase/stripe_queries";
import { cookies } from "next/headers";

export default async function PricingPage() {
  const supabase = createClient(cookies());
  const products = await getProducts();

  return (
    <Pricing
      products={products ?? []}
    />
  );
}
