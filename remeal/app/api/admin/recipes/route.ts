import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, ingredients, instructions } = await request.json();
    const supabase = createClient(cookies());

    const { data, error } = await supabase
      .from('recipes')
      .insert({ name, ingredients, instructions })
      .select();

    if (error) throw error;

    // Call the recipe ingestion function to update indexes
    await fetch('/api/recipe_ingestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data[0]),
    });

    return NextResponse.json({ message: 'Recipe saved successfully', data: data[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
