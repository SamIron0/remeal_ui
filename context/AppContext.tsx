"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/supabase/types";

interface AppContextType {
  user: Tables<"users"> | null;
  subscription: Tables<"subscriptions"> | null;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Tables<"users"> | null>(null);
  const [subscription, setSubscription] =
    useState<Tables<"subscriptions"> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserAndSubscription() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("auth_user_id", user.id)
          .single();

        if (userData) {
          setUser(userData);

          const { data: subscriptionData, error: subscriptionError } =
            await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id)
              .single();

          if (subscriptionData) {
            setSubscription(subscriptionData);
          } else if (subscriptionError) {
            console.error("Error fetching subscription:", subscriptionError);
          }
        } else if (userError) {
          console.error("Error fetching user profile:", userError);
        }
      }
      setLoading(false);
    }

    loadUserAndSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          loadUserAndSubscription();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setSubscription(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider value={{ user, subscription, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
