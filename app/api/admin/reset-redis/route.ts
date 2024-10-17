import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redis } from "@/utils/redis";
import { getRecipesFromSupabase } from "@/utils/supabase/search";

const BATCH_SIZE = 10; // Adjust this value based on your needs

async function processBatch(keys: string[]) {
  console.log(`Processing batch of ${keys.length} keys`);
  const promises = keys.map(async (key) => {
    const ingredients = key.split(",");
    const results = await getRecipesFromSupabase(ingredients);
    const recipeIds = results.map(recipe => recipe.id);
    console.log(`Processed key: ${key}, found ${recipeIds.length} recipe IDs`);
    return redis.set(key, JSON.stringify(recipeIds));
  });
  await Promise.all(promises);
  console.log(`Batch processing complete`);
}

export async function POST() {
  try {
    console.log("Starting Redis cache reset");
    const supabase = createClient(cookies());
    const keys = await redis.keys("*");
    console.log(`Found ${keys.length} keys to process`);

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batch = keys.slice(i, i + BATCH_SIZE);
      await processBatch(batch);
      console.log(`Completed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(keys.length / BATCH_SIZE)}`);
    }

    console.log("Redis cache reset completed successfully");
    return NextResponse.json({
      message: "Redis cache reset successfully and page metadata updated",
    });
  } catch (error: any) {
    console.error("Error resetting Redis cache:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
