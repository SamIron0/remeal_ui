import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Recipe } from "@/types";

const BATCH_SIZE = 10;
const SIMILARITY_THRESHOLD = 0.43;

export async function getRecipes(ingredients: string[]): Promise<Recipe[]> {
  const supabase = createClient(cookies());
  const recipeMap = new Map<number, Recipe>();

  for (let i = 0; i < ingredients.length; i += BATCH_SIZE) {
    const batch = ingredients.slice(i, i + BATCH_SIZE);
    const batchResults = await processIngredientBatch(batch, supabase);

    for (const recipe of batchResults) {
      if (recipeMap.has(recipe.id)) {
        recipeMap.get(recipe.id)!.matchedIngredients?.push(...(recipe.matchedIngredients || []));
      } else {
        recipeMap.set(recipe.id, recipe);
      }
    }

    if (i === 0 && recipeMap.size === 0) return [];
  }

  return Array.from(recipeMap.values()).sort((a, b) =>
    (b.matchedIngredients?.length || 0) - (a.matchedIngredients?.length || 0)
  );
}

async function processIngredientBatch(batch: string[], supabase: any): Promise<Recipe[]> {
  const results = await Promise.all(batch.map(ingredient => processIngredient(ingredient, supabase)));
  return results.flat();
}

async function processIngredient(ingredient: string, supabase: any): Promise<Recipe[]> {
  try {
    const newRecipes = await fetchNewRecipes(ingredient, supabase);
    return newRecipes;
  } catch (error) {
    console.error(`Error processing ingredient ${ingredient}:`, error);
    return [];
  }
}

async function fetchNewRecipes(ingredient: string, supabase: any): Promise<Recipe[]> {
  const { data, error } = await supabase.rpc("search_recipes_by_ingredient", {
    p_ingredient: ingredient,
    similarity_threshold: SIMILARITY_THRESHOLD,
  });

  if (error) throw new Error(`Error fetching recipes for ${ingredient}`);

  // Find the index of the first recipe that falls below the threshold
  const endIndex = data.findIndex((recipe: any) => recipe.avg_similarity < SIMILARITY_THRESHOLD);
  // If all recipes meet the threshold, return the entire array
  if (endIndex === -1) return data.map((recipe: any) => ({
    ...recipe,
    matchedIngredients: [ingredient],
  }));

  // Slice from 0 to endIndex (exclusive) to get all recipes above the threshold
  const filteredData = data.slice(0, endIndex);

  return filteredData.map((recipe: any) => ({
    ...recipe,
    matchedIngredients: [ingredient],
  }));
}

export async function getRecipesFromSupabase(ingredients: string[]): Promise<any[]> {
  const supabase = createClient(cookies());
  const results = await Promise.all(ingredients.map(ingredient =>
    supabase.rpc("search_recipes_by_ingredient", {
      p_ingredient: ingredient,
      similarity_threshold: SIMILARITY_THRESHOLD,
    })
  ));
  return results.flatMap(result => result.data || []);
}
