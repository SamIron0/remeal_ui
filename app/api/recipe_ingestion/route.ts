import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import getRedisClient from "@/utils/redis";
import { normalizeIngredient } from "@/utils/helper";

export async function POST(request: Request) {
  try {
    console.log("Received POST request in recipe_ingestion");
    const recipeData = await request.json();
    console.log("Received recipe data:", recipeData);

    const cookieStore = cookies();
    const supabase = createClient(cookieStore, true); // Use service role
    console.log("Inserting recipe into database");
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        name: recipeData.name,
        instructions: recipeData.instructions,
        description: recipeData.description,
        cook_time: recipeData.cook_time,
        prep_time: recipeData.prep_time,
        servings: recipeData.servings,
        user_id: null, // Assuming this is set to null for admin-created recipes
      })
      .select();

    if (error) {
      console.error("Error inserting recipe:", error);
      throw error;
    }

    console.log("Recipe inserted successfully:", data);

    const recipeId = data[0].id;
    console.log("Indexing recipe ingredients");
    await indexRecipe(recipeId, recipeData.ingredients);
    console.log("Recipe ingredients indexed successfully");

    return Response.json(
      { message: "Recipe ingestion successful" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in recipe_ingestion POST:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

async function indexRecipe(recipeId: number, ingredients: string[]) {
  const normalizedIngredients = ingredients.map(normalizeIngredient);
  const cookieStore = cookies();
  const supabase = createClient(cookieStore, true); // Use service role
  const redis = getRedisClient();
  for (const ingredient of normalizedIngredients) {
    const { data, error } = await supabase.rpc("index_ingredient", {
      p_ingredient: ingredient,
      p_recipe_id: recipeId,
    });

    if (error) {
      console.error("Error in index_ingredient:", error);
      throw error;
    }

    // Update Redis
    console.log(`Updating Redis for ingredient: ${ingredient}`);
    const redisKey = `ingredient:${ingredient}`;
    const existingRecipes = await redis.get(redisKey);
    if (existingRecipes) {
      await redis.set(redisKey, `${existingRecipes},${recipeId}`);
      console.log(`Updated Redis key ${redisKey} with recipe ${recipeId}`);
    } else {
      await redis.set(redisKey, `${recipeId}`);
      console.log(`Created new Redis key ${redisKey} with recipe ${recipeId}`);
    }
  }
}
