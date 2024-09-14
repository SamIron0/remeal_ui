import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import getRedisClient from "@/utils/redis";

export async function DELETE(request: Request) {
  try {
    const { recipeId } = await request.json();

    const supabase = createClient();
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);

    if (error) throw error;

    await removeRecipeFromIndex(recipeId);

    return NextResponse.json({ message: "Recipe deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function removeRecipeFromIndex(recipeId: number) {
  const supabase = createClient();

  try {
    // Get the recipe ingredients from the junction table
    const { data: recipeIngredients, error: ingredientsError } = await supabase
      .from("recipe_ingredients")
      .select("ingredient_id")
      .eq("recipe_id", recipeId);

    if (ingredientsError) throw ingredientsError;

    // Remove recipe from Supabase ingredient index
    for (const { ingredient_id } of recipeIngredients) {
     
      const { error } = await supabase.rpc("remove_ingredient_from_index", {
        p_ingredient: ingredient_id.toString(),
        p_recipe_id: recipeId,
      });

      if (error) {
        console.error(
          `Error removing ingredient ${ingredient_id} from index:`,
          error
        );
        throw error;
      }
    }

   
  } catch (error) {
    console.error("Error in removeRecipeFromIndex:", error);
    throw error;
  }
}
