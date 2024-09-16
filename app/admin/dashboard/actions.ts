import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getDashboardData() {
  const supabase = createClient(cookies());
  
  let metricsData, recentRecipes, popularIngredients, userActivity;

  try {
    const { data, error: metricsError } = await supabase.rpc('get_dashboard_metrics');
    if (metricsError) {
      console.error('Error fetching dashboard metrics:', metricsError);
      throw metricsError;
    }
    metricsData = data[0] as {
      total_recipes: number;
      total_users: number;
      recipes_this_month: number;
      active_users: number;
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    metricsData = {
      total_recipes: 0,
      total_users: 0,
      recipes_this_month: 0,
      active_users: 0
    };
  }

  try {
    const recipesResult = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (recipesResult.error) throw recipesResult.error;
    recentRecipes = recipesResult.data;
  } catch (error) {
    console.error('Error fetching recent recipes:', error);
  }

  try {
    const { data: ingredientsData, error: ingredientsError } = await supabase.rpc('get_popular_ingredients');
    if (ingredientsError) throw ingredientsError;
    popularIngredients = ingredientsData as Array<{ ingredient: string; count: number }>;
  } catch (error) {
    console.error('Error fetching popular ingredients:', error);
  }

  try {
    const { data: activityData, error: activityError } = await supabase.rpc('get_user_activity');
    if (activityError) throw activityError;
    userActivity = activityData as Array<{ activity_date: string; new_users: number }>;
  } catch (error) {
    console.error('Error fetching user activity:', error);
  }

  return { metricsData, recentRecipes, popularIngredients, userActivity };
}
