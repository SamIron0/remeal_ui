const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupDatabase() {
  try {
    // Fetch all recipes
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("id, name, slug")
      .order("created_at", { ascending: true });

    if (error) throw error;

    const recipeMap = new Map();
    const slugMap = new Map();
    const duplicatesToDelete = [];
    const slugsToUpdate = [];

    // Identify duplicates and duplicate slugs
    for (const recipe of recipes) {
      const lowerName = recipe.name.toLowerCase();
      const lowerSlug = recipe.slug ? recipe.slug.toLowerCase() : "";

      if (recipeMap.has(lowerName)) {
        duplicatesToDelete.push(recipe.id);
      } else {
        recipeMap.set(lowerName, recipe.id);
      }

      if (slugMap.has(lowerSlug)) {
        slugsToUpdate.push(recipe.id);
      } else {
        slugMap.set(lowerSlug, recipe.id);
      }
    }

    // Delete duplicates and their related data
    for (const recipeId of duplicatesToDelete) {
      await deleteRecipeAndRelatedData(recipeId);
    }

    // Update duplicate slugs
    for (const recipeId of slugsToUpdate) {
      await deleteRecipeAndRelatedData(recipeId);
    }

    // Clean up ingredient_index table
    await cleanupIngredientIndex();
  } catch (error) {
    console.error("Error in cleanupDatabase:", error);
  }
}

async function deleteRecipeAndRelatedData(recipeId) {
  const tables = [
    "nutrition_info",
    "recipe_images",
    "recipe_ingredients",
    "recipe_tags",
    "recipe_vectors",
    "saved_recipes",
    "recipe_page_metadata",
  ];

  try {
    // Delete related data from other tables
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("recipe_id", recipeId);

      if (error) throw error;
    }

    // Delete the recipe itself
    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting recipe ${recipeId}:`, error);
  }
}

async function cleanupIngredientIndex() {
  try {
    // Fetch all ingredient_index entries
    const { data: ingredientIndexes, error } = await supabase
      .from("ingredient_index")
      .select("id, recipe_ids");

    if (error) throw error;

    for (const index of ingredientIndexes) {
      if (index.recipe_ids && Array.isArray(index.recipe_ids)) {
        // Fetch existing recipes
        const { data: existingRecipes, error: recipeError } = await supabase
          .from("recipes")
          .select("id")
          .in("id", index.recipe_ids);

        if (recipeError) throw recipeError;

        const validRecipeIds = existingRecipes.map((recipe) => recipe.id);

        // Update ingredient_index if there are changes
        if (validRecipeIds.length !== index.recipe_ids.length) {
          const { error: updateError } = await supabase
            .from("ingredient_index")
            .update({ recipe_ids: validRecipeIds })
            .eq("id", index.id);

          if (updateError) throw updateError;
        }
      }
    }
  } catch (error) {
    console.error("Error in cleanupIngredientIndex:", error);
  }
}

cleanupDatabase();
