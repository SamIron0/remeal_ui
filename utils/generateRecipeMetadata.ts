import { Tables, TablesInsert } from "@/supabase/types";

export async function generateRecipeMetadata(
  recipeId: string
): Promise<TablesInsert<"recipe_page_metadata">> {
  return {
    recipe_id: 0,
    url: "test",
    title: "Test",
    description: "Test",
    keywords: ["Test"],
    ingredients: ["Test"],
    changefreq: 1,
    priority: 1,
  };
}
