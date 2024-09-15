"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Tables } from "@/supabase/types";

type UserWithSubscription = Tables<"users"> & {
  subscriptions: Tables<"subscriptions">[] | null;
};

export default function ProfileForm() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<UserWithSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
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
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);

    // TODO: Implement subscription cancellation logic
    // This might involve calling a server-side API to handle the cancellation with Stripe

    toast.success("Subscription cancelled successfully");
    setIsLoading(false);
  };

  const handleUpgrade = () => {
    router.push("/membership"); // Assuming you have an upgrade page
  };

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  const subscription = profile.subscriptions?.[0];
  const subscriptionStatus = subscription?.status || "No active subscription";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          View and edit your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" value={profile.email} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={profile.full_name || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label>Membership Status</Label>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                subscriptionStatus === "active" ? "default" : "secondary"
              }
            >
              {subscriptionStatus}
            </Badge>
            {subscriptionStatus === "active" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Cancel Membership
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will cancel your
                      membership and you will lose access to all premium
                      features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {subscriptionStatus !== "active" && (
              <Button onClick={handleUpgrade} size="sm">
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600">
          
          Subscription renews on:{" "}
          {subscription?.current_period_end
            ? new Date(subscription.current_period_end).toLocaleDateString()
            : "N/A"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  );
}
