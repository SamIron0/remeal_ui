import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import redis from '@/utils/redis';
import { cookies } from 'next/headers';
import { normalizeIngredient } from '@/utils/helper';
import getRedisClient from '@/utils/redis';

export async function PUT(request: Request) {
  try {
    const { id, name, ingredients, instructions } = await request.json();
    const supabase = createClient(cookies());

    // Get the old recipe ingredients from the junction table
    const { data: oldIngredients, error: oldIngredientsError } = await supabase
      .from('recipe_ingredients')
      .select('ingredient_id')
      .eq('recipe_id', id);

    if (oldIngredientsError) throw oldIngredientsError;

    // Update the ingredient index
    await updateIngredientIndex(id, oldIngredients.map(item => item.ingredient_id.toString()), ingredients);

    // Update the recipe
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ name, instructions })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ message: 'Recipe updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function updateIngredientIndex(recipeId: number, oldIngredients: string[], newIngredients: string[]) {
  const supabase = createClient(cookies());

  // Remove old ingredients from index
  for (const ingredient of oldIngredients) {
    await supabase.rpc('remove_ingredient_from_index', {
      p_ingredient: normalizeIngredient(ingredient),
      p_recipe_id: recipeId
    });
  }

  // Add new ingredients to index
  for (const ingredient of newIngredients) {
    await supabase.rpc('index_ingredient', {
      p_ingredient: normalizeIngredient(ingredient),
      p_recipe_id: recipeId
    });
  }

  // Update Redis
  const redis = getRedisClient();
  const allKeys = await redis.keys('ingredient:*');
  for (const key of allKeys) {
    const ingredient = key.split(':')[1];
    if (oldIngredients.includes(ingredient) || newIngredients.includes(ingredient)) {
      const recipes = await redis.get(key) as string | null;
      if (recipes) {
        const recipeList = new Set(recipes.split(','));
        if (newIngredients.includes(ingredient)) {
          recipeList.add(recipeId.toString());
        } else {
          recipeList.delete(recipeId.toString());
        }
        if (recipeList.size > 0) {
          await redis.set(key, Array.from(recipeList).join(','));
          console.log(`Updated Redis key ${key} for recipe ${recipeId}`);
        } else {
          await redis.del(key);
          console.log(`Deleted Redis key ${key} as it no longer has any recipes`);
        }
      } else if (newIngredients.includes(ingredient)) {
        await redis.set(key, recipeId.toString());
        console.log(`Created new Redis key ${key} for recipe ${recipeId}`);
      }
    }
  }
}