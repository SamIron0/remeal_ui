import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getDashboardData() {
  const supabase = createClient(cookies());
  
  const { data: metricsData } = await supabase.rpc('get_dashboard_metrics');
  const { data: recentRecipes } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  const { data: popularIngredients } = await supabase.rpc('get_popular_ingredients');
  const { data: userActivity } = await supabase.rpc('get_user_activity');

  return { metricsData, recentRecipes, popularIngredients, userActivity };
}
