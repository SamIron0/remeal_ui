import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createClient(cookies());
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
    *,
    nutrition_info(*),
    recipe_images(file_path, file_name),
    recipe_ingredients(
      quantity,
      unit,
      ingredients(name)
    )
  `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
