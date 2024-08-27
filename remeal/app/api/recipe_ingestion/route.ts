import { createClient } from "@/utils/supabase/client";
import redis from "@/utils/redis";

export async function POST(request: Request) {
  try {
    const recipeData = await request.json();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        name: recipeData.name,
        instructions: recipeData.instructions,
        ingredients: recipeData.ingredients,
      })
      .select();

    if (error) throw error;

    const recipeId = data[0].id;
    await indexRecipe(recipeId, recipeData.ingredients);
    const imageGenerationResponse = await fetch(
      "https://remeal.food/api/image_generation",
      {
        method: "POST",
        body: JSON.stringify({ recipeId }),
      }
    );
    return Response.json({ id: recipeId }, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
async function indexRecipe(recipeId: number, ingredients: string[]) {
  const normalizedIngredients = ingredients.map(normalizeIngredient);
  const supabase = createClient();
  for (const ingredient of normalizedIngredients) {
    await supabase.rpc("index_ingredient", {
      p_ingredient: ingredient,
      p_recipe_id: recipeId,
    });

    // Update Redis
    const redisKey = `ingredient:${ingredient}`;
    const existingRecipes = await redis.get(redisKey);
    if (existingRecipes) {
      await redis.set(redisKey, `${existingRecipes},${recipeId}`);
    } else {
      await redis.set(redisKey, `${recipeId}`);
    }
  }
}

function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\b(s|es)$/, "")
    .trim();
}
