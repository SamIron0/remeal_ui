import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getRecipes } from "@/utils/supabase/search";
import { generateRecipeMetadata } from "@/utils/generateRecipeMetadata";
import { TablesInsert } from "@/supabase/types";
export async function POST(request: Request) {
  const supabase = createClient(cookies());

  // Fetch all page metadata
  const { data: pageMetadata, error: fetchError } = await supabase
    .from("search_page_metadata")
    .select("id, ingredients");

  if (fetchError) {
    throw new Error("Failed to fetch page metadata");
  }

  // Rerun recipe search for each page metadata
  for (const page of pageMetadata) {
    if (page.ingredients && page.ingredients.length > 0) {
      const recipes = await getRecipes(page.ingredients);
      if (!recipes) {
        console.error(`Failed to update recipes for page ${page.id}`);
      }
      const recipeIds = recipes.map((recipe: any) => recipe.id);

      // Update page metadata with new recipe IDs
      console.log("recipeIds", recipeIds);
      const { error: updateError } = await supabase
        .from("search_page_metadata")
        .update({ recipe_ids: recipeIds })
        .eq("id", page.id);

      if (updateError) {
        console.error(`Failed to update page metadata for page ${page.id}`);
      }
      // create page metadata for all recipes not currently in the database

      // get all recipes
      const { data: allRecipes, error: recipesError } = await supabase
        .from("recipes")
        .select("id");
      if (recipesError || !allRecipes) {
        console.log("Failed to get recipes", recipesError);
        return NextResponse.json({ message: "Failed to get recipes" });
      }
      const allRecipeIds = allRecipes?.map((recipe: any) => recipe.id);

      // get all recipe page metadata
      const { data: recipePageMetadata, error: recipePageMetadataError } = await supabase
        .from("search_page_metadata")
        .select("recipe_id")
      if (recipePageMetadataError) {
        console.log("Failed to get recipe page metadata", recipePageMetadataError);
      }
      const recipePageMetadataIds = recipePageMetadata?.map((recipe: any) => recipe.recipe_id);

      for (const recipeId of allRecipeIds) {
        if (!recipePageMetadataIds?.includes(recipeId)) {
          // call llm to generate recipe page metadata
          const recipeMetadata: TablesInsert<"recipe_page_metadata"> = await generateRecipeMetadata(recipeId);
        }
      }
    }
  }

  return NextResponse.json({ message: "Page metadata updated successfully" });
}
