import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const baseUrl = "https://remeal-samiron0-samiron0s-projects.vercel.app/";
const apiUrl = `${baseUrl}/api/recipe_ingestion`;

export async function POST(request: Request) {
  try {
    const supabase = createClient(cookies());
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const {
      name,
      ingredients,
      instructions,
      description,
      cook_time,
      prep_time,
      servings,
    } = await request.json();


    // Call the recipe ingestion function to update indexes
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        name,
        ingredients, 
        instructions,
        description,
        cook_time,
        prep_time,
        servings,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Recipe ingestion failed: ${responseData.error || 'Unknown error'}`);
    }

    return NextResponse.json({ message: "Recipe saved successfully" });
  } catch (error: any) {
    console.error("Error in admin/recipes POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
