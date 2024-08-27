import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import redis from '@/utils/redis';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  try {
    const { id, name, ingredients, instructions } = await request.json();
    const supabase = createClient(cookies());

    // Get the old recipe data
    const { data: oldRecipe, error: oldRecipeError } = await supabase
      .from('recipes')
      .select('ingredients')
      .eq('id', id)
      .single();

    if (oldRecipeError) throw oldRecipeError;

    // Update the recipe
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ name, ingredients, instructions })
      .eq('id', id);

    if (updateError) throw updateError;

    // Update the ingredient index
    await updateIngredientIndex(id, oldRecipe.ingredients, ingredients);

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
  const allKeys = await redis.keys('ingredient:*');
  for (const key of allKeys) {
    const ingredient = key.split(':')[1];
    if (oldIngredients.includes(ingredient) || newIngredients.includes(ingredient)) {
      const recipes = await redis.get(key);
      if (recipes) {
        const recipeList = new Set(recipes.split(','));
        if (newIngredients.includes(ingredient)) {
          recipeList.add(recipeId.toString());
        } else {
          recipeList.delete(recipeId.toString());
        }
        if (recipeList.size > 0) {
          await redis.set(key, Array.from(recipeList).join(','));
        } else {
          await redis.del(key);
        }
      } else if (newIngredients.includes(ingredient)) {
        await redis.set(key, recipeId.toString());
      }
    }
  }
}

function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(s|es)$/, '')
    .trim();
}
