"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function SaveRecipeButton({
  recipeId,
  userId,
}: {
  recipeId: number; 
  userId: string | undefined;
}) {
  const { savedRecipes, setSavedRecipes } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const isSaved = savedRecipes.includes(recipeId);
  const handleSaveUnsave = async () => {
    if (!userId) {
      toast.error("You must be logged in to save recipes");
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_recipes")
          .delete()
          .eq("user_id", userId)
          .eq("recipe_id", recipeId);

        if (error) throw error;

        setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
        toast.success("Recipe unsaved successfully");
      } else {
        const { error } = await supabase
          .from("saved_recipes")
          .upsert(
            { user_id: userId, recipe_id: recipeId },
            { onConflict: "user_id,recipe_id" }
          );

        if (error) throw error;

        setSavedRecipes([...savedRecipes, recipeId]);
        toast.success("Recipe saved successfully");
      }
    } catch (error) {
      console.error("Error saving/unsaving recipe:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSaveUnsave}
      disabled={isLoading || !userId}
      variant={isSaved ? "secondary" : "default"}
    >
      <Bookmark className="w-4 h-4 mr-2" />
      {isSaved ? "Unsave" : "Save"}
    </Button>
  );
}
