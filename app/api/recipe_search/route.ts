import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import getRedisClient from "@/utils/redis";
import { cookies } from "next/headers";
import { normalizeIngredient } from "@/utils/helpers";

export async function POST(request: Request) {
  try {
    const supabase = createClient(cookies());
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: userSubscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .single();

    const isPremium = userSubscription?.status === "active";

    const { ingredients, dietaryRestrictions, maxCookTime, minRating } =
      await request.json();
    const normalizedIngredients = ingredients.map(normalizeIngredient);

    const results = await getRecipes(normalizedIngredients, isPremium, maxCookTime);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error in recipe search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getRecipes(ingredients: string[], isPremium: boolean, maxCookTime: number | null) {
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
  // Remove duplicates from recipeIds
  const uniqueRecipeIds = Array.from(new Set(recipeIds));

  // Fetch details for recipes found in Redis
  if (uniqueRecipeIds.length > 0) {
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
      *,
      nutrition_info(*),
      recipe_images(file_path, file_name),
      recipe_ingredients(
        quantity,
        unit,
        ingredients(name)
      )
    `
      )
      .in("id", uniqueRecipeIds);

    if (error) {
      console.error("Error fetching recipes with ingredients:", error);
      throw error;
    }

    recipesWithIngredientsFromRedis = data || [];
    recipesWithIngredients = recipesWithIngredientsFromRedis;
  }

  // Check Supabase for ingredients not found in Redis using RPC
  if (notFoundInRedis.size > 0) {
    const { data: recipesWithIngredientsFromSupabase, error } =
      await supabase.rpc("search_recipes_by_ingredients", {
        p_ingredients: Array.from(notFoundInRedis),
        similarity_threshold: 0.3,
      });

    if (error) {
      console.error("Error fetching from Supabase:", error);
    } else if (recipesWithIngredientsFromSupabase) {
      recipesWithIngredients = [
        ...recipesWithIngredientsFromRedis,
        ...recipesWithIngredientsFromSupabase,
      ];
    }
  }
  // Remove duplicates
  const uniqueRecipes = recipesWithIngredients.filter(
    (recipe, index, self) => index === self.findIndex((t) => t.id === recipe.id)
  );

  // Modify the recipe data based on premium status
  const modifiedRecipes = uniqueRecipes.map((recipe) => {
    if (!isPremium) {
      // Remove nutrition_info for non-premium users
      const { nutrition_info, ...recipeWithoutNutrition } = recipe;
      return recipeWithoutNutrition;
    }
    return recipe;
  });

  // Filter recipes based on maxCookTime
  const filteredRecipes = maxCookTime
    ? modifiedRecipes.filter((recipe) => (recipe.cook_time || 0) <= maxCookTime)
    : modifiedRecipes;

  // Sort recipes by the number of matching ingredients
  const sortedRecipes = filteredRecipes.sort((a, b) => {
    const aMatches = a.recipe_ingredients.filter((i: any) =>
      normalizedIngredients.includes(normalizeIngredient(i.ingredients.name))
    ).length;
    const bMatches = b.recipe_ingredients.filter((i: any) =>
      normalizedIngredients.includes(normalizeIngredient(i.ingredients.name))
    ).length;
    return bMatches - aMatches;
  });

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
