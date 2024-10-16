"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/types";

export default function SavedRecipes() {
  const { savedRecipes } = useApp();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecipes() {
      if (savedRecipes.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("recipes")
        .select(
          `
          id,
          name,
          description
        `
        )
        .in("id", savedRecipes);

      if (error) {
        console.error("Error fetching saved recipes:", error);
      } else {
        if (data) {
          setRecipes(data);
        }
      }
      setLoading(false);
    }

    fetchRecipes();
  }, [savedRecipes, supabase]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-64px)] mt-16">
      <h1 className="text-3xl font-bold mb-6">Your Saved Recipes</h1>
      {recipes.length === 0 ? (
        <p>You haven&apos;t saved any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                <Link href={`/recipe/${recipe.name}`}>
                  <Button>View Recipe</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
