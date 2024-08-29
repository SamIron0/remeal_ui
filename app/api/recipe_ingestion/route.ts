import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import getRedisClient from "@/utils/redis";
import { normalizeIngredient } from "@/utils/helpers";
import { getTopNutritionMatch } from "@/utils/usda_api";
import { extractIngredientName } from "@/utils/extract_ingredient_name";

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
  console.log(`Starting indexRecipe for recipeId: ${recipeId}`);
  const normalizedIngredients = ingredients.map(normalizeIngredient);
  console.log(
    `Normalized ingredients: ${JSON.stringify(normalizedIngredients)}`
  );
  const cookieStore = cookies();
  const supabase = createClient(cookieStore, true); // Use service role
  const redis = getRedisClient();

  for (const ingredient of normalizedIngredients) {
    console.log(`Processing ingredient: ${ingredient}`);
    const extractedName = await extractIngredientName(ingredient);
    console.log(`Extracted ingredient name: ${extractedName}`);
    const nutritionInfo = await getTopNutritionMatch(extractedName);
    console.log(`Nutrition info for ${extractedName}:`, nutritionInfo);

    console.log(`Calling index_ingredient for ${extractedName}`);
    const { data, error } = await supabase.rpc("index_ingredient", {
      p_recipe_id: recipeId,
      p_ingredient: extractedName,
      p_quantity: 1, // Default quantity, adjust as needed
      p_unit: "", // Default empty unit, adjust as needed
      p_calories: nutritionInfo?.calories || 0,
      p_protein: nutritionInfo?.protein || 0,
      p_fat: nutritionInfo?.fat || 0,
      p_carbohydrates: nutritionInfo?.carbohydrates || 0,
    });

    if (error) {
      console.error(`Error in index_ingredient for ${extractedName}:`, error);
      throw error;
    }
    console.log(`Successfully indexed ${extractedName} with nutrition info`);

    // Update Redis
    console.log(`Updating Redis for ingredient: ${extractedName}`);
    const redisKey = `ingredient:${extractedName}`;
    const existingRecipes = await redis.get(redisKey);
    if (existingRecipes) {
      await redis.set(redisKey, `${existingRecipes},${recipeId}`);
      console.log(`Updated Redis key ${redisKey} with recipe ${recipeId}`);
    } else {
      await redis.set(redisKey, `${recipeId}`);
      console.log(`Created new Redis key ${redisKey} with recipe ${recipeId}`);
    }
  }
  console.log(`Finished indexRecipe for recipeId: ${recipeId}`);
}
