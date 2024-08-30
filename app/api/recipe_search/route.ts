import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import getRedisClient from '@/utils/redis';
import { cookies } from 'next/headers';
import { normalizeIngredient } from '@/utils/helpers';

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    const normalizedIngredients = ingredients.map(normalizeIngredient);
    console.log('Normalized ingredients:', normalizedIngredients);

    // First, try to get results from Redis
    console.log('Attempting to fetch recipes from Redis...');
    const redisResults = await getRecipesFromRedis(normalizedIngredients);
    console.log(`Redis results count: ${redisResults.length}`);

    if (redisResults.length > 0) {
      console.log('Sorting Redis results...');
      // Sort Redis results by the number of matching ingredients
      const sortedRedisResults = redisResults.sort((a, b) => {
        const aMatches = a.ingredients.filter((i: string) => normalizedIngredients.includes(normalizeIngredient(i))).length;
        const bMatches = b.ingredients.filter((i: string) => normalizedIngredients.includes(normalizeIngredient(i))).length;
        return bMatches - aMatches;
      });
      console.log(`Returning ${sortedRedisResults.length} sorted Redis results`);
      return NextResponse.json(sortedRedisResults);
    }

    // If no results from Redis, query Supabase
    console.log('No Redis results, querying Supabase...');
    const supabaseResults = await getRecipesFromSupabase(normalizedIngredients);
    console.log(`Supabase results count: ${supabaseResults.length}`);
    return NextResponse.json(supabaseResults);
  } catch (error: any) {
    console.error('Error in recipe search:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getRecipesFromRedis(ingredients: string[]) {
  console.log('Entering getRecipesFromRedis');
  const redis = getRedisClient();
  const recipeIds = new Set<string>();
  for (const ingredient of ingredients) {
    const key = `ingredient:${ingredient}`;
    const ids = await redis.get(key);
    console.log(`Redis key ${key}: ${ids ? JSON.stringify(ids) : 'null'}`);
    if (ids) {
      if (typeof ids === 'string') {
        ids.split(',').forEach(id => recipeIds.add(id));
      } else if (Array.isArray(ids)) {
        ids.forEach(id => recipeIds.add(id.toString()));
      } else if (typeof ids === 'number') {
        recipeIds.add(ids.toString());
      } else {
        console.warn(`Unexpected type for ids: ${typeof ids}`);
      }
    }
  }
  
  console.log(`Total unique recipe IDs from Redis: ${recipeIds.size}`);
  if (recipeIds.size === 0) return [];

  const supabase = createClient(cookies());
  console.log('Fetching recipe details from Supabase...');
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, name, description')
    .in('id', Array.from(recipeIds));

  if (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }

  console.log(`Fetched ${recipes?.length || 0} recipes from Supabase`);

  console.log('Fetching recipe ingredients...');
  const { data: recipeIngredients, error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, ingredients(name)')
    .in('recipe_id', Array.from(recipeIds));

  if (ingredientsError) {
    console.error('Error fetching recipe ingredients:', ingredientsError);
    throw ingredientsError;
  }

  console.log(`Fetched ingredients for ${recipeIngredients?.length || 0} recipe-ingredient combinations`);

  const recipesWithIngredients = recipes?.map(recipe => ({
    ...recipe,
    ingredients: recipeIngredients
      ?.filter(ri => ri.recipe_id === recipe.id)
      .map(ri => ri.ingredients?.name)
      .filter(Boolean) as string[]
  }));

  console.log(`Returning ${recipesWithIngredients?.length || 0} recipes with ingredients`);
  return recipesWithIngredients || [];
}

async function getRecipesFromSupabase(ingredients: string[]) {
  console.log('Entering getRecipesFromSupabase');
  const supabase = createClient(cookies());
  console.log('Calling search_recipes_by_ingredients RPC...');
  const { data, error } = await supabase
    .rpc('search_recipes_by_ingredients', { p_ingredients: ingredients });

  if (error) {
    console.error('Error in search_recipes_by_ingredients RPC:', error);
    throw error;
  }

  console.log(`RPC returned ${data?.length || 0} results`);
  // The results are already sorted by match_count in descending order
  return data;
}