import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get("recipeId");

  if (!recipeId) {
    return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
  }

  const supabase = createClient(cookies());

  try {
    // First, get the current recipe's ingredients
    const { data: currentRecipe, error: recipeError } = await supabase
      .from("recipes")
      .select("recipe_ingredients(ingredients(name))")
      .eq("id", recipeId)
      .single();

    if (recipeError) throw recipeError;

    const ingredients = currentRecipe.recipe_ingredients.map((ri: any) => ri.ingredients.name);

    // Then, find recipes with similar ingredients
    const { data: similarRecipes, error: similarError } = await supabase
      .from("recipes")
      .select(`
        id,
        name,
        description,
        cook_time,
        recipe_ingredients(ingredients(name))
      `)
      .neq("id", recipeId)
      .filter("recipe_ingredients.ingredients.name", "in", `(${ingredients.join(",")})`)
      .limit(3);

    if (similarError) throw similarError;

    return NextResponse.json(similarRecipes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

