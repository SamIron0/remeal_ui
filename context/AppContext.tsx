"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/supabase/types";
import { Recipe } from "@/types";

interface AppContextType {
  user: Tables<"users"> | null;
  subscription: any | null;
  loading: boolean;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  savedRecipes: number[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<number[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Tables<"users"> | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
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
            setSubscription(null);
          } else {
            // No subscription found
            setSubscription(null);
          }

          const { data, error } = await supabase
            .from('saved_recipes')
            .select('recipe_id')
            .eq('user_id', userData.auth_user_id);

          if (error) {
            console.error('Error fetching saved recipes:', error);
            setSavedRecipes([]);
          } else {
            const savedRecipeIds = data.map(item => item.recipe_id);
            setSavedRecipes(savedRecipeIds);
          }

        } else if (userError) {
          console.error("Error fetching user profile:", userError);
        }
      } else {
        setUser(null);
        setSubscription(null);
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
  }, []); // Add supabase.auth as a dependency

  return (
    <AppContext.Provider
      value={{ user, subscription, loading, recipes, setRecipes, ingredients, setIngredients, savedRecipes, setSavedRecipes }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
