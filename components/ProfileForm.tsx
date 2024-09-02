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
import { UserProfile } from "@/types";
import { Tables } from "@/supabase/types";

export default function ProfileForm() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Tables<"users">>({
    auth_user_id: "",
    avatar_url: "",
    created_at: "",
    email: "",
    full_name: "",
    id: "",
    subscription_end_date: "",
    subscription_status: null,
    trial_end_date: "",
    trial_start_date: "",
    updated_at: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } else {
        setProfile(data);
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, [supabase, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setProfile((prev: any) =>
      prev
        ? {
            ...prev,
            notification_settings: {
              ...prev.notification_settings,
              [name]: checked,
            },
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("users")
      .update(profile)
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
    setIsSaving(false);
  };

  const handleUpgrade = async () => {
   // router.push("/checkout");
  };

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      setIsSaving(true);
      const { error } = await supabase
        .from("users")
        .update({ subscription_status: "cancelled" })
        .eq("id", profile.id);

      if (error) {
        console.error("Error cancelling subscription:", error);
        toast.error("Failed to cancel subscription");
      } else {
        toast.success("Subscription cancelled successfully");
        setProfile({ ...profile, subscription_status: "cancelled" });
      }
      setIsSaving(false);
    }
  };

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
        {profile.subscription_status === "trial" && (
          <div>
            <p>You are currently on a free trial.</p>
            <p>
              Trial ends on:{" "}
              {new Date(profile.trial_end_date || "").toLocaleDateString()}
            </p>
            <Button onClick={() => handleUpgrade()} className="mt-4">
              Upgrade to Premium
            </Button>
          </div>
        )}
        {profile.subscription_status === "active" && (
          <div>
            <p>You have an active premium membership.</p>
            <p>
              Subscription renews on:{" "}
              {new Date(
                profile.subscription_end_date || ""
              ).toLocaleDateString()}
            </p>
            <Button onClick={() => handleCancelSubscription()} className="mt-4">
              Cancel Subscription
            </Button>
          </div>
        )}
        {profile.subscription_status === "expired" && (
          <div>
            <p>Your membership has expired.</p>
            <Button onClick={() => handleUpgrade()} className="mt-4">
              Renew Membership
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
