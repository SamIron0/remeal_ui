"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/supabase/types";

type UserWithSubscription = Tables<"users"> & {
  subscriptions: Tables<"subscriptions">[] | null;
};

export default function ProfileForm() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<UserWithSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*, subscriptions(*)")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } else {
        setProfile(data as unknown as UserWithSubscription);
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, [supabase, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("users")
      .update({
        full_name: profile.full_name,
        // Add other fields you want to update
      })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
    setIsLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      setIsLoading(true);

      // TODO: Implement subscription cancellation logic
      // This might involve calling a server-side API to handle the cancellation with Stripe

      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/upgrade"); // Assuming you have an upgrade page
  };

  const subscription = profile?.subscriptions?.[0];
  const subscriptionStatus = subscription?.status;

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" value={profile.email} disabled />
      </div>

      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={profile.full_name || ""}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Membership Status</h2>
        Profile status: {subscriptionStatus || 'No active subscription'}
        {subscription && subscriptionStatus === "trialing" && (
          <div>
            <p>You are currently on a free trial.</p>
            <p>
              Trial ends on:{" "}
              {new Date(
                subscription.trial_end || ""
              ).toLocaleDateString()}
            </p>
            <Button onClick={handleUpgrade} className="mt-4">
              Upgrade to Premium
            </Button>
          </div>
        )}
        {subscription && subscriptionStatus === "active" && (
          <div>
            <p>You have an active premium membership.</p>
            <p>
              Subscription renews on:{" "}
              {new Date(
                subscription.current_period_end || ""
              ).toLocaleDateString()}
            </p>
            <Button onClick={handleCancelSubscription} className="mt-4">
              Cancel Subscription
            </Button>
          </div>
        )}
        {(!subscription || subscriptionStatus === "canceled") && (
          <div>
            <p>
              Your membership has expired or you don't have an active
              subscription.
            </p>
            <Button onClick={handleUpgrade} className="mt-4">
              Upgrade to Premium
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
