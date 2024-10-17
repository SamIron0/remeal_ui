import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { updateRedis, getRedis } from "@/utils/redis";
import { Recipe } from "@/types";

const BATCH_SIZE = 10;
const SIMILARITY_THRESHOLD = 0.3;

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
    const cachedRecipes = await getCachedRecipes(ingredient, supabase);
    if (cachedRecipes.length > 0) return cachedRecipes;

    const newRecipes = await fetchNewRecipes(ingredient, supabase);
    await cacheRecipes(ingredient, newRecipes);
    return newRecipes;
  } catch (error) {
    console.error(`Error processing ingredient ${ingredient}:`, error);
    return [];
  }
}

async function getCachedRecipes(ingredient: string, supabase: any): Promise<Recipe[]> {
  const cachedRecipeIds = await getRedis(ingredient);
  if (!Array.isArray(cachedRecipeIds)) return [];

  const { data: cachedRecipes, error } = await supabase
    .from("recipes")
    .select(`
      *,
      nutrition_info(*),
      recipe_images(file_path, file_name),
      recipe_ingredients(quantity, unit, ingredients(name))
    `)
    .in("id", cachedRecipeIds);

  if (error) throw new Error(`Error fetching cached recipes for ${ingredient}`);

  return cachedRecipes.map((recipe: any) => ({
    ...recipe,
    matchedIngredients: [ingredient],
  }));
}

async function fetchNewRecipes(ingredient: string, supabase: any): Promise<Recipe[]> {
  const { data, error } = await supabase.rpc("search_recipes_by_ingredient", {
    p_ingredient: ingredient,
    similarity_threshold: SIMILARITY_THRESHOLD,
  });

  if (error) throw new Error(`Error fetching recipes for ${ingredient}`);

  return data.map((recipe: any) => ({
    ...recipe,
    matchedIngredients: [ingredient],
  }));
}

async function cacheRecipes(ingredient: string, recipes: Recipe[]): Promise<void> {
  const recipeIds = recipes.map(recipe => recipe.id.toString());
  await updateRedis(ingredient, recipeIds);
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
