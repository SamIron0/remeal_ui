import { getRecipes } from "@/utils/supabase/search";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ingredients } = await request.json();
    const results = await getRecipes(ingredients);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error in recipe search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
