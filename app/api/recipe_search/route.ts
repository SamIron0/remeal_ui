import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import getRedisClient from "@/utils/redis";
import { cookies } from "next/headers";
import { normalizeIngredient } from "@/utils/helpers";

export async function POST(request: Request) {
  try {
    const { ingredients, dietaryRestrictions, maxCookTime, minRating } =
      await request.json();
    const normalizedIngredients = ingredients.map(normalizeIngredient);
    console.log("Normalized ingredients:", normalizedIngredients);

    console.log("Attempting to fetch recipes from Redis...");
    const results = await getRecipes(normalizedIngredients);
    console.log(`results count: ${results.length}`);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error in recipe search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getRecipes(ingredients: string[]) {
  console.log("Entering getRecipesFromRedis");
  const redis = getRedisClient();
  const supabase = createClient(cookies());
  const recipeIds = new Set<string>();
  const notFoundInRedis = new Set<string>();
  const normalizedIngredients = ingredients.map(normalizeIngredient);

  // Fetch recipe IDs from Redis
  await Promise.all(
    normalizedIngredients.map(async (ingredient) => {
      const exactMatchIds = await redis.get(ingredient);
      if (exactMatchIds) {
        addIdsToSet(recipeIds, exactMatchIds);
      } else {
        notFoundInRedis.add(ingredient);
      }
    })
  );

  let recipes: any[] = [];
  let recipesWithIngredients: any[] = []; 
  let recipesWithIngredientsFromRedis: any[] = [];
  let recipesWithIngredientsFromSupabase: any[] = [];
  // Fetch details for recipes found in Redis
  if (recipeIds.size > 0) {
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("id, name, description")
      .in("id", Array.from(recipeIds));

    if (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }

    console.log("Fetching recipe ingredients...");
    const { data: recipeIngredients, error: ingredientsError } = await supabase
      .from("recipe_ingredients")
      .select("recipe_id, ingredient_id, ingredients(name)")
      .in("recipe_id", Array.from(recipeIds));

    if (ingredientsError) {
      console.error("Error fetching recipe ingredients:", ingredientsError);
      throw ingredientsError;
    }

    console.log(
      `Fetched ingredients for ${
        recipeIngredients?.length || 0
      } recipe-ingredient combinations`
    );

    recipesWithIngredientsFromRedis = recipes?.map((recipe) => ({
      ...recipe,
      ingredients: recipeIngredients
        ?.filter((ri) => ri.recipe_id === recipe.id)
        .map((ri) => ri.ingredients?.name)
        .filter(Boolean) as string[],
    }));
    recipesWithIngredients = recipesWithIngredientsFromRedis;
  }
  // Check Supabase for ingredients not found in Redis using RPC
  if (notFoundInRedis.size > 0) {
    console.log(
      "Checking Supabase for ingredients:",
      Array.from(notFoundInRedis)
    );
    const { data: recipesWithIngredientsFromSupabase, error } = await supabase.rpc(
      "search_recipes_by_ingredients",
      {
        p_ingredients: Array.from(notFoundInRedis),
        similarity_threshold: 0.3,
      }
    );
  
    if (error) {
      console.error("Error fetching from Supabase:", error);
    } else if (recipesWithIngredientsFromSupabase) {
      recipesWithIngredients = [...recipesWithIngredientsFromRedis, ...recipesWithIngredientsFromSupabase];
    }
  }

  // Remove duplicates
  const uniqueRecipes = recipesWithIngredients.filter(
    (recipe, index, self) => index === self.findIndex((t) => t.id === recipe.id)
  );
  console.log("unique recipes", uniqueRecipes);

  // Sort recipes by the number of matching ingredients
  const sortedRecipes = uniqueRecipes.sort((a, b) => {
    const aMatches = a.ingredients.filter((i: string) =>
      normalizedIngredients.includes(normalizeIngredient(i))
    ).length;
    const bMatches = b.ingredients.filter((i: string) =>
      normalizedIngredients.includes(normalizeIngredient(i))
    ).length;
    return bMatches - aMatches;
  });

  console.log(`Returning ${sortedRecipes.length} sorted unique recipes`);
  return sortedRecipes;
}

function addIdsToSet(set: Set<string>, ids: string | string[] | number | {}) {
  if (typeof ids === "string") {
    ids.split(",").forEach((id) => set.add(id));
  } else if (Array.isArray(ids)) {
    ids.forEach((id) => set.add(id.toString()));
  } else if (typeof ids === "number") {
    set.add(ids.toString());
  } else {
    console.warn(`Unexpected type for ids: ${typeof ids}`);
  }
}
