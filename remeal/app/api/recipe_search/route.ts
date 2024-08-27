import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import redis from '@/utils/redis';
import { cookies } from 'next/headers';
import { normalizeIngredient } from '@/utils/helper';

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    const normalizedIngredients = ingredients.map(normalizeIngredient);

    // First, try to get results from Redis
    const redisResults = await getRecipesFromRedis(normalizedIngredients);
    if (redisResults.length > 0) {
      // Sort Redis results by the number of matching ingredients
      const sortedRedisResults = redisResults.sort((a, b) => {
        const aMatches = a.ingredients.filter((i: string) => normalizedIngredients.includes(normalizeIngredient(i))).length;
        const bMatches = b.ingredients.filter((i: string) => normalizedIngredients.includes(normalizeIngredient(i))).length;
        return bMatches - aMatches;
      });
      return NextResponse.json(sortedRedisResults);
    }

    // If no results from Redis, query Supabase
    const supabaseResults = await getRecipesFromSupabase(normalizedIngredients);
    return NextResponse.json(supabaseResults);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getRecipesFromRedis(ingredients: string[]) {
  const recipeIds = new Set<string>();
  for (const ingredient of ingredients) {
    const key = `ingredient:${ingredient}`;
    const ids = await redis.get(key);
    if (ids) {
      ids.split(',').forEach(id => recipeIds.add(id));
    }
  }
  
  if (recipeIds.size === 0) return [];

  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from('recipes')
    .select('id, name, description, ingredients')
    .in('id', Array.from(recipeIds));

  if (error) throw error;
  return data;
}

async function getRecipesFromSupabase(ingredients: string[]) {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .rpc('search_recipes_by_ingredients', { p_ingredients: ingredients });

  if (error) throw error;

  // The results are already sorted by match_count in descending order
  return data;
}