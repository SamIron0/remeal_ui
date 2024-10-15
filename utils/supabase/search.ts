import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { updateRedis, getRedis } from "@/utils/redis";
import { Recipe } from "@/types";

export async function getRecipes(ingredients: string[]) {
  const supabase = createClient(cookies());
  const BATCH_SIZE = 10; // Adjust based on your database performance

  const processIngredientBatch = async (batch: string[]) => {
    const results = await Promise.all(
      batch.map(async (ingredient) => {
        const cachedResult = await getRedis(ingredient);
        if (cachedResult) {
          return cachedResult;
        }

        const { data, error } = await supabase.rpc(
          "search_recipes_by_ingredient",
          {
            p_ingredient: ingredient,
            similarity_threshold: 0.3,
          }
        );
        if (error) {
          console.error(`Error fetching recipes for ${ingredient}:`, error);
          return [];
        }

        const processedData = data.map((recipe: any) => ({
          ...recipe,
          matchedIngredients: [ingredient],
        }));
        updateRedis(ingredient, processedData);
        return processedData;
      })
    );
    return results.flat();
  };
  const recipeMap = new Map<number, Recipe>();

  for (let i = 0; i < ingredients.length; i += BATCH_SIZE) {
    const batch = ingredients.slice(i, i + BATCH_SIZE);
    const batchResults = await processIngredientBatch(batch);

    for (const recipe of batchResults as Recipe[]) {
      if (recipeMap.has(recipe.id)) {
        recipeMap
          .get(recipe.id)!
          .matchedIngredients?.push(...(recipe.matchedIngredients || []));
      } else {
        recipeMap.set(recipe.id, recipe);
      }
    }

    if (i === 0 && recipeMap.size === 0) {
      return [];
    }
  }

  const finalRecipes = Array.from(recipeMap.values());
  finalRecipes.sort(
    (a, b) =>
      (b.matchedIngredients?.length || 0) - (a.matchedIngredients?.length || 0)
  );
  return finalRecipes;
}

export async function getRecipesFromSupabase(ingredients: string[]) {
  const supabase = createClient(cookies());
  const result = [];
  for (const ingredient of ingredients) {
    const { data, error } = await supabase.rpc("search_recipes_by_ingredient", {
      p_ingredient: ingredient,
      similarity_threshold: 0.3,
    });
    result.push(data);
  }
  return result.flat();
}
