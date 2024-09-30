import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { normalizeIngredient } from "@/utils/helpers";

export async function POST(request: Request) {
  try {
    const supabase = createClient(cookies());
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    let isPremium = false;
    if (user) {
      const { data: userSubscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      isPremium = userSubscription?.status === "active";
    }

    const { ingredients, dietaryRestrictions, maxCookTime, minRating } =
      await request.json();
    const normalizedIngredients = ingredients.map(normalizeIngredient);

    const results = await getRecipes(
      normalizedIngredients,
      isPremium,
      maxCookTime
    );

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error in recipe search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getRecipes(
  ingredients: string[],
  isPremium: boolean,
  maxCookTime: number | null
) {
  const supabase = createClient(cookies());
  const normalizedIngredients = ingredients.map(normalizeIngredient);

  const { data: recipesWithIngredients, error } = await supabase.rpc("search_recipes_by_ingredients", {
    p_ingredients: normalizedIngredients,
    similarity_threshold: 0.3,
  });

  if (error) {
    console.error("Error fetching from Supabase:", error);
    throw error;
  }

  const uniqueRecipes = recipesWithIngredients.filter(
    (recipe, index, self) => index === self.findIndex((t) => t.id === recipe.id)
  );

  const modifiedRecipes = uniqueRecipes.map((recipe) => {
    if (!isPremium) {
      const { nutrition_info, ...recipeWithoutNutrition } = recipe;
      return recipeWithoutNutrition;
    }
    return recipe;
  });

  const filteredRecipes = maxCookTime
    ? modifiedRecipes.filter((recipe) => (recipe.cook_time || 0) <= maxCookTime)
    : modifiedRecipes;

  const sortedRecipes = filteredRecipes.sort((a, b) => {
    const aMatches = Array.isArray(a.recipe_ingredients) 
      ? a.recipe_ingredients.filter((i: any) =>
          normalizedIngredients.includes(normalizeIngredient(i.ingredients.name))
        ).length
      : 0;
    const bMatches = Array.isArray(b.recipe_ingredients) 
      ? b.recipe_ingredients.filter((i: any) =>
          normalizedIngredients.includes(normalizeIngredient(i.ingredients.name))
        ).length
      : 0;
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