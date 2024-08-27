import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import { normalizeIngredient } from '@/utils/helper'
import redis from '@/utils/redis'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const recipeId = parseInt(params.id)
  
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (error) throw error

    await removeRecipeFromIndex(recipeId)

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function removeRecipeFromIndex(recipeId: number) {
  const supabase = createClient();
  
  try {
    // Get the recipe ingredients from the junction table
    const { data: recipeIngredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select('ingredient_id')
      .eq('recipe_id', recipeId);

    if (ingredientsError) throw ingredientsError;

    // Remove recipe from Supabase ingredient index
    for (const { ingredient_id } of recipeIngredients) {
      console.log(`Removing recipe ${recipeId} from index for ingredient: ${ingredient_id}`);
      const { error } = await supabase.rpc('remove_ingredient_from_index', {
        p_ingredient: ingredient_id.toString(),
        p_recipe_id: recipeId
      });

      if (error) {
        console.error(`Error removing ingredient ${ingredient_id} from index:`, error);
        throw error;
      }
    }

    console.log(`Successfully removed recipe ${recipeId} from all ingredient indexes`);

    // Update Redis (keep this part as it is)
    await redis.del(`recipe:${recipeId}`);
    const allKeys = await redis.keys('ingredient:*');
    for (const key of allKeys) {
      const ingredient = key.split(':')[1];
      const recipes = await redis.get(key);
      if (recipes) {
        const recipeList = new Set(recipes.split(','));
        recipeList.delete(recipeId.toString());
        if (recipeList.size > 0) {
          await redis.set(key, Array.from(recipeList).join(','));
        } else {
          await redis.del(key);
        }
      }
    }
    console.log(`Successfully updated Redis for recipe ${recipeId}`);
  } catch (error) {
    console.error('Error in removeRecipeFromIndex:', error);
    throw error;
  }
}
